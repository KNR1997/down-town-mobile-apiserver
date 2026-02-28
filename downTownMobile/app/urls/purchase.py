from django.urls import path

from downTownMobile.app.views.purchase.base import PurchaseViewSet

urlpatterns = [
    path(
        "purchases/",
        PurchaseViewSet.as_view({"get": "list", "post": "create"}),
        name="purchase",
    ),
    path(
        "purchases/<str:slug>/",
        PurchaseViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="purchase",
    ),
]
