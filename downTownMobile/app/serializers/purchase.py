from rest_framework import serializers

from downTownMobile.db.models import Purchase


class PurchaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = '__all__'


class PurchaseListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = [
            'id',
            'reference_number',
            'total_amount',
            'status',
            'ordered_at',
            'received_at',
        ]
