from django.urls import path

from downTownMobile.app.views.manufacturer.base import ManufacturerViewSet

urlpatterns = [
    path(
        "manufacturers/",
        ManufacturerViewSet.as_view({"get": "list", "post": "create"}),
        name="manufacturer",
    ),
    path(
        "manufacturers/<str:slug>/",
        ManufacturerViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="manufacturer",
    ),
]
