from rest_framework import status
from rest_framework.response import Response

from downTownMobile.app.serializers.shop import ShopListSerializer, ShopSerializer
from downTownMobile.app.views.base import BaseViewSet
from downTownMobile.db.models import Shop


# Create your views here.
class ShopViewSet(BaseViewSet):
    model = Shop
    serializer_class = ShopListSerializer

    search_fields = ['name']
    filterset_fields = []

    lookup_field = "slug"

    def get_queryset(self):
        return (
            self.filter_queryset(super().get_queryset())
        )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = ShopSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        shop = serializer.save()

        output = self.serializer_class(shop, context={"request": request}).data
        return Response(output, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        shop = Shop.objects.get(slug=kwargs["slug"])

        serializer = ShopSerializer(
            shop,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        shop = serializer.save()

        output = self.serializer_class(shop, context={"request": request}).data
        return Response(output, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
