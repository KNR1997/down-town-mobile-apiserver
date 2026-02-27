from downTownMobile.db.models import Author
from rest_framework import serializers


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = '__all__'


class AuthorListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = [
            'id',
            'name',
            'slug',
            'language',
            'translated_languages',
            'products_count',
            'is_approved',
            'bio',
            'languages',
            'image',
            'cover_image',
        ]
