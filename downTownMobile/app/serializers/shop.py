from django.utils.text import slugify
from rest_framework import serializers

from downTownMobile.db.models import Shop


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = '__all__'

    def create(self, validated_data):
        slug = slugify(validated_data.get("name"))
        validated_data["slug"] = slug

        return super().create(validated_data)


class ShopListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = [
            'id',
            'name',
            'slug',
            'is_active',
        ]
