from django.urls import path

from downTownMobile.app.views.type.base import TypeViewSet

urlpatterns = [
    path(
        "types/",
        TypeViewSet.as_view({"get": "list", "post": "create"}),
        name="type",
    ),
    path(
        "types/<str:slug>/",
        TypeViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="type",
    ),
]
