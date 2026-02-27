from django.urls import path

from downTownMobile.app.views.author.base import AuthorViewSet

urlpatterns = [
    path(
        "authors/",
        AuthorViewSet.as_view({"get": "list", "post": "create"}),
        name="author",
    ),
    path(
        "authors/<str:slug>/",
        AuthorViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="author",
    ),
]
