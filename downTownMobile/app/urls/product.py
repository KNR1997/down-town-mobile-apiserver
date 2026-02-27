from django.urls import path

from downTownMobile.app.views.product.base import ProductViewSet
from downTownMobile.app.views.product.draft import DraftProductViewSet

urlpatterns = [
    path(
        "products/",
        ProductViewSet.as_view({"get": "list", "post": "create"}),
        name="product",
    ),
    path(
        "products/<str:slug>/",
        ProductViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="product",
    ),
    path(
        "draft-products/",
        DraftProductViewSet.as_view({"get": "list"}),
        name="draft-product",
    ),
]
