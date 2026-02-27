from django.urls import path

from downTownMobile.app.views.user.base import UserViewSet, AdminViewSet

urlpatterns = [
    path(
        "users/",
        UserViewSet.as_view({"get": "list", "post": "create"}),
        name="user",
    ),
    path(
        "users/<uuid:pk>/",
        UserViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="user",
    ),
    path(
        "admin/list/",
        AdminViewSet.as_view({"get": "list", "post": "create"}),
        name="user",
    ),
]
