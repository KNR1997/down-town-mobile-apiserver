from downTownMobile.app.serializers.type import TypeListSerializer
from downTownMobile.db.models import Tag
from rest_framework import serializers


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'


class TagListSerializer(serializers.ModelSerializer):
    type = TypeListSerializer()

    class Meta:
        model = Tag
        fields = [
            'id',
            'name',
            'slug',
            'language',
            'translated_languages',
            'details',
            'icon',
            'type',
        ]
