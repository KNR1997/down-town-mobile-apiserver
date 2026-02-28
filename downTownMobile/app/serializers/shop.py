from crum import get_current_user
from django.utils.text import slugify
from rest_framework import serializers

from downTownMobile.db.models import Shop


class ShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = '__all__'
        read_only_fields = ['slug']  # prevent manual editing

    def _generate_unique_slug(self, name, instance_id=None):
        base_slug = slugify(name)
        slug = base_slug
        counter = 1

        queryset = Shop.objects.all()

        # Exclude current instance during update
        if instance_id:
            queryset = queryset.exclude(id=instance_id)

        while queryset.filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        return slug

    def create(self, validated_data):
        name = validated_data.get("name")
        validated_data["slug"] = self._generate_unique_slug(name)
        user = get_current_user()
        if user:
            validated_data["owner_id"] = user.id

        return super().create(validated_data)

    def update(self, instance, validated_data):
        name = validated_data.get("name", None)

        if name and name != instance.name:
            validated_data["slug"] = self._generate_unique_slug(
                name,
                instance_id=instance.id
            )

        return super().update(instance, validated_data)


class ShopListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = [
            'id',
            'name',
            'slug',
            'is_active',
            'balance',
            'settings',
        ]
