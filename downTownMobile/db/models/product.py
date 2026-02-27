# Django imports
from django.db import models

# Module imports
from .base import BaseModel


def default_translated_languages():
    return ["en"]


class Product(BaseModel):
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    width = models.CharField(max_length=255, null=True, blank=True)
    height = models.CharField(max_length=255, null=True, blank=True)
    min_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    max_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    sku = models.CharField(max_length=100, null=True, blank=True)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0)
    in_stock = models.BooleanField(default=True)
    is_taxable = models.BooleanField(default=False)
    status = models.CharField(max_length=50, choices=[('publish', 'Publish'), ('draft', 'Draft')], default='publish')
    product_type = models.CharField(max_length=50, choices=[('variable', 'Variable'), ('simple', 'Simple')])
    unit = models.CharField(max_length=50, default='1 Stk', blank=True, null=True)
    image = models.JSONField(default=dict, blank=True, null=True)
    gallery = models.JSONField(default=list, blank=True, null=True)
    ratings = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    language = models.CharField(max_length=10, default='en', blank=True, null=True)
    translated_languages = models.JSONField(default=default_translated_languages, blank=True, null=True)

    type = models.ForeignKey('db.Type', blank=True, null=True, on_delete=models.SET_NULL, default=None)
    categories = models.ManyToManyField('db.Category', blank=True)
    tags = models.ManyToManyField('db.Tag', blank=True)
    author = models.ForeignKey('db.Author', blank=True, null=True, on_delete=models.SET_NULL, default=None)
    manufacturer = models.ForeignKey('db.Manufacturer', blank=True, null=True, on_delete=models.SET_NULL, default=None)

    def __str__(self):
        return self.name


class ProductVariation(BaseModel):
    title = models.CharField(max_length=255)
    cartesian_product_key = models.CharField(max_length=255, null=True)
    barcode = models.CharField(max_length=15, unique=True, blank=True, null=True)
    image = models.JSONField(default=dict, blank=True, null=True)
    default_quantity = models.IntegerField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    in_stock = models.BooleanField(default=True)

    product = models.ForeignKey(
        'db.Product', related_name='variations', on_delete=models.CASCADE
    )
    attribute = models.ManyToManyField(
        'db.Attribute', blank=True
    )
    value = models.ManyToManyField(
        'db.AttributeValue', blank=True
    )

    def __str__(self):
        return f"{self.product.name} - {self.title}"