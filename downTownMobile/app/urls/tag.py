from django.urls import path

from downTownMobile.app.views.tag.base import TagViewSet

urlpatterns = [
    path(
        "tags/",
        TagViewSet.as_view({"get": "list", "post": "create"}),
        name="tag",
    ),
    path(
        "tags/<str:slug>/",
        TagViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="tag",
    ),
]
