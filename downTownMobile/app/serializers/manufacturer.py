from downTownMobile.app.serializers.type import TypeListSerializer
from downTownMobile.db.models import Manufacturer
from rest_framework import serializers


class ManufacturerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Manufacturer
        fields = '__all__'


class ManufacturerListSerializer(serializers.ModelSerializer):
    type = TypeListSerializer()

    class Meta:
        model = Manufacturer
        fields = [
            'id',
            'name',
            'slug',
            'language',
            'translated_languages',
            'products_count',
            'is_approved',
            'description',
            'website',
            'type',
        ]
