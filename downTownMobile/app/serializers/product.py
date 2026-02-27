from django.db import transaction
from rest_framework import serializers

from downTownMobile.app.serializers.category import CategoryListSerializer
from downTownMobile.app.serializers.manufacturer import ManufacturerListSerializer
from downTownMobile.app.serializers.tag import TagListSerializer
from downTownMobile.app.serializers.type import TypeListSerializer
from downTownMobile.db.models import Product


class OptionSerializer(serializers.Serializer):
    name = serializers.CharField()
    value = serializers.CharField()


class UpsertSerializer(serializers.Serializer):
    title = serializers.CharField()
    sku = serializers.CharField()
    options = OptionSerializer(many=True)


class VariationOptionsSerializer(serializers.Serializer):
    upsert = UpsertSerializer(many=True)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'

    def create(self, validated_data):
        categories = validated_data.pop('categories', [])

        with transaction.atomic():
            product = Product.objects.create(**validated_data)
            product.categories.set(categories)

        return product

    def update(self, instance, validated_data):
        categories = validated_data.pop('categories', None)
        tags = validated_data.pop('tags', None)

        with transaction.atomic():
            for attr, value in validated_data.items():
                setattr(instance, attr, value)
            instance.save()

            if categories is not None:
                instance.categories.set(categories)
                instance.tags.set(tags)

        return instance


class ProductListSerializer(serializers.ModelSerializer):
    type = TypeListSerializer()
    categories = CategoryListSerializer(many=True, read_only=True)
    tags = TagListSerializer(many=True, read_only=True)
    manufacturer = ManufacturerListSerializer(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'
