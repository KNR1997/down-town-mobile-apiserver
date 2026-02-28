from django.urls import path

from downTownMobile.app.views.warehouse.base import WarehouseViewSet

urlpatterns = [
    path(
        "warehouses/",
        WarehouseViewSet.as_view({"get": "list", "post": "create"}),
        name="warehouse",
    ),
    path(
        "warehouses/<uuid:pk>/",
        WarehouseViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="warehouse",
    ),
]
