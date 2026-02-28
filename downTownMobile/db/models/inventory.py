# Django imports
from django.db import models


class Inventory(models.Model):
    product = models.ForeignKey(
        'db.Product',
        on_delete=models.CASCADE,
        related_name="inventories"
    )

    warehouse = models.ForeignKey(
        'db.Warehouse',
        on_delete=models.CASCADE,
        related_name="inventories"
    )

    # Cached values for performance
    available_quantity = models.IntegerField(default=0)
    reserved_quantity = models.IntegerField(default=0)

    class Meta:
        unique_together = ("product", "warehouse")

    def __str__(self):
        return f"{self.product.name} - {self.warehouse.name}"

    @property
    def sellable_quantity(self):
        return self.available_quantity - self.reserved_quantity
