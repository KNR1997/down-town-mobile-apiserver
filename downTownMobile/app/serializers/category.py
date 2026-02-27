from downTownMobile.app.serializers.type import TypeListSerializer
from downTownMobile.db.models import Category
from rest_framework import serializers


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CategoryListSerializer(serializers.ModelSerializer):
    type = TypeListSerializer()

    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'language',
            'translated_languages',
            'parent',
            'details',
            'icon',
            'type',
        ]
