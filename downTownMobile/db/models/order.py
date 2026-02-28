# Django imports
from django.db import models
from django.db.models import JSONField

# Module imports
from .base import BaseModel


class Order(BaseModel):
    PAYMENT_GATEWAY_CHOICES = [
        ("CASH_ON_DELIVERY", "Cash On Delivery"),
    ]

    ORDER_STATUS_CHOICES = [
        ("order-completed", "Completed"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("payment-cash-on-delivery", "Cash On Delivery"),
    ]

    tracking_number = models.CharField(max_length=50, unique=True)

    customer = models.ForeignKey(
        'db.Customer',
        on_delete=models.CASCADE,
        related_name="orders"
    )

    customer_contact = models.CharField(max_length=50)
    customer_name = models.CharField(max_length=255)

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    sales_tax = models.DecimalField(max_digits=10, decimal_places=2)
    paid_total = models.DecimalField(max_digits=10, decimal_places=2)
    total = models.DecimalField(max_digits=10, decimal_places=2)

    note = models.TextField(blank=True)

    cancelled_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cancelled_tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    cancelled_delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    language = models.CharField(max_length=10, default="en")

    coupon_id = models.UUIDField(null=True, blank=True)
    parent_id = models.UUIDField(null=True, blank=True)
    shop_id = models.UUIDField(null=True, blank=True)

    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    payment_gateway = models.CharField(
        max_length=50,
        choices=PAYMENT_GATEWAY_CHOICES
    )

    altered_payment_gateway = models.CharField(
        max_length=50,
        null=True,
        blank=True
    )

    shipping_address = JSONField()
    billing_address = JSONField()

    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_time = models.CharField(max_length=100)

    order_status = models.CharField(
        max_length=50,
        choices=ORDER_STATUS_CHOICES
    )

    payment_status = models.CharField(
        max_length=50,
        choices=PAYMENT_STATUS_CHOICES
    )

    def __str__(self):
        return f"Order #{self.id} - {self.tracking_number}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        "db.Order",
        on_delete=models.CASCADE,
        related_name="items"
    )

    product = models.ForeignKey(
        'db.Product',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    # Snapshot fields (VERY IMPORTANT)
    product_name = models.CharField(max_length=255)
    product_sku = models.CharField(max_length=100)

    quantity = models.PositiveIntegerField()

    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    total = models.DecimalField(max_digits=10, decimal_places=2)

    cancelled_quantity = models.PositiveIntegerField(default=0)
    cancelled_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product_name} (x{self.quantity})"

    # def save(self, *args, **kwargs):
    #     # Auto-calculate subtotal & total if not manually provided
    #     self.subtotal = self.unit_price * self.quantity
    #     self.total = self.subtotal + self.tax - self.discount
    #     super().save(*args, **kwargs)
