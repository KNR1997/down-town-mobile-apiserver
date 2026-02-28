# Django imports
from django.db import models

from downTownMobile.db.models.base import BaseModel


class Warehouse(BaseModel):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    address = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class WarehouseTransfer(BaseModel):
    from_warehouse = models.ForeignKey(
        'db.Warehouse',
        on_delete=models.CASCADE,
        related_name="transfers_out"
    )
    to_warehouse = models.ForeignKey(
        'db.Warehouse',
        on_delete=models.CASCADE,
        related_name="transfers_in"
    )
    reference_number = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.reference_number
