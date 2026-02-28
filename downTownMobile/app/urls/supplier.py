from django.urls import path

from downTownMobile.app.views.supplier.base import SupplierViewSet

urlpatterns = [
    path(
        "suppliers/",
        SupplierViewSet.as_view({"get": "list", "post": "create"}),
        name="supplier",
    ),
    path(
        "suppliers/<str:slug>/",
        SupplierViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="supplier",
    ),
]
