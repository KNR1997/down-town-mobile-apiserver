from django.db import models


class Purchase(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("ordered", "Ordered"),
        ("partial", "Partially Received"),
        ("received", "Received"),
        ("cancelled", "Cancelled"),
    ]
    supplier = models.ForeignKey(
        'db.Supplier',
        on_delete=models.CASCADE,
        related_name="purchases"
    )
    warehouse = models.ForeignKey(
        'db.Warehouse',
        on_delete=models.PROTECT,
        related_name="purchases"
    )
    reference_number = models.CharField(max_length=100, unique=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    ordered_at = models.DateTimeField(null=True, blank=True)
    received_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.reference_number}"


class PurchaseItem(models.Model):
    purchase = models.ForeignKey(
        Purchase,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(
        'db.Product',
        on_delete=models.CASCADE,
        related_name="purchase_items"
    )
    quantity_ordered = models.PositiveIntegerField()
    quantity_received = models.PositiveIntegerField(default=0)
    unit_cost = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        self.subtotal = self.quantity_ordered * self.unit_cost
        super().save(*args, **kwargs)
