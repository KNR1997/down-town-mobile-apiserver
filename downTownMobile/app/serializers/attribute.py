from django.utils.text import slugify
from rest_framework import serializers

from downTownMobile.app.serializers.base import BaseSerializer
from downTownMobile.db.models import Attribute, AttributeValue


class AttributeCreateSerializer(BaseSerializer):
    class Meta:
        model = Attribute
        fields = '__all__'
        read_only_fields = ['slug']

    def create(self, validated_data):
        return super().create(validated_data)


class AttributeValueSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = AttributeValue
        fields = '__all__'
        read_only_fields = ["id", "attribute"]


class AttributeValueListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeValue
        fields = '__all__'


class AttributeSerializer(serializers.ModelSerializer):
    values = AttributeValueSerializer(many=True)
    # non-related Attribute field (pop before create or update)
    deleted_values = serializers.ListField(
        child=serializers.CharField(),
        required=False,
    )

    class Meta:
        model = Attribute
        fields = '__all__'
        read_only_fields = ["slug"]

    # Custom create()
    def create(self, validated_data):
        # pop all the non-related Attribute fields from the validated_data
        values = validated_data.pop("values")

        # slugify name to be used on Attribute create
        slug = slugify(validated_data.get("name"))

        # create Attribute
        attribute = Attribute.objects.create(slug=slug, **validated_data)
        # bulk_create AttributeValue
        AttributeValue.objects.bulk_create(
            [
                AttributeValue(
                    attribute=attribute,
                    value=attribute_value.get('value'),
                    meta=attribute_value.get('meta'),
                )
                for attribute_value in values
            ]
        )
        return attribute

    def update(self, instance, validated_data):
        # pop all the non-related Attribute fields from the validated_data
        values = validated_data.pop("values", [])
        deleted_values = validated_data.pop("deleted_values", [])

        # slugify name to be used on Attribute update
        slug = slugify(validated_data.get("name"))

        # update Attribute
        attribute = Attribute.objects.filter(
            id=instance.id
        ).update(
            slug=slug,
            **validated_data
        )

        # update or create new AttributeValues
        for value in values:
            if value['id']:
                AttributeValue.objects.filter(
                    id=value['id'],
                ).update(
                    value=value.get("value"),
                    meta=value.get("meta"),
                )
            else:
                AttributeValue.objects.create(
                    attribute_id=instance.id,
                    value=value.get("value"),
                    meta=value.get("meta"),
                )

        # delete AttributeValues
        AttributeValue.objects.filter(
            attribute=instance,
            id__in=deleted_values
        ).delete()

        return attribute


class AttributeListSerializer(serializers.ModelSerializer):
    values = AttributeValueListSerializer(many=True)

    class Meta:
        model = Attribute
        fields = [
            'id',
            'name',
            'slug',
            'language',
            'translated_languages',
            'values',
        ]