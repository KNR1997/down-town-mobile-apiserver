from django.urls import path

from downTownMobile.app.views.category.base import CategoryViewSet

urlpatterns = [
    path(
        "categories/",
        CategoryViewSet.as_view({"get": "list", "post": "create"}),
        name="category",
    ),
    path(
        "categories/<str:slug>/",
        CategoryViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
        name="category",
    ),
]
