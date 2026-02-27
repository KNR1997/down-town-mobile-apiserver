from downTownMobile.db.models import Type
from rest_framework import serializers


class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = '__all__'


class TypeListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = [
            'id',
            'name',
            'slug',
            'banners',
            'promotional_sliders',
            'icon',
            'language',
            'translated_languages',
            'settings',
        ]
