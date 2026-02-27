from rest_framework import serializers

from downTownMobile.app.serializers.base import BaseSerializer
from downTownMobile.app.serializers.shop import ShopListSerializer
from downTownMobile.db.models import User


class UserLiteSerializer(BaseSerializer):
    shops = ShopListSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'display_name',
            'mobile_number',
            'email',
            'first_name',
            'last_name',
            'shops',
        ]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'display_name',
            'mobile_number',
        ]


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'mobile_number',
            'email',
            'display_name',
            'first_name',
            'last_name',
            'is_active',
            'role_name'
        ]
