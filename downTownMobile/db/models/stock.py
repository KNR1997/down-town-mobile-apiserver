# Django imports
from django.db import models


class StockMovement(models.Model):
    MOVEMENT_TYPES = [
        ("purchase", "Purchase"),
        ("sale", "Sale"),
        ("return", "Return"),
        ("adjustment", "Adjustment"),
        ("transfer_out", "Transfer Out"),
        ("transfer_in", "Transfer In"),
    ]
    product = models.ForeignKey(
        'db.Product',
        on_delete=models.CASCADE
    )
    warehouse = models.ForeignKey(
        'db.Warehouse',
        on_delete=models.CASCADE
    )
    quantity = models.IntegerField()  # + or -
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    reference_type = models.CharField(max_length=50, blank=True, null=True)
    reference_id = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} ({self.quantity})"


class StockReservation(models.Model):
    product = models.ForeignKey(
        'db.Product',
        on_delete=models.CASCADE
    )
    warehouse = models.ForeignKey(
        'db.Warehouse',
        on_delete=models.CASCADE
    )
    order_item = models.ForeignKey(
        "OrderItem",
        on_delete=models.CASCADE,
        related_name="reservations"
    )
    quantity = models.PositiveIntegerField()
    is_released = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
