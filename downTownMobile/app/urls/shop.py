from django.urls import path

from downTownMobile.app.views.shop.base import ShopViewSet

urlpatterns = [
    path(
        "shops/",
        ShopViewSet.as_view({"get": "list", "post": "create"}),
        name="shop",
    ),
    path(
        "shops/<str:slug>/",
        ShopViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="shop",
    ),
]
