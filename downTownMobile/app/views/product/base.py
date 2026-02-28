from rest_framework import status
from rest_framework.response import Response

from downTownMobile.app.serializers.product import ProductListSerializer, ProductSerializer
from downTownMobile.app.views.base import BaseViewSet
from downTownMobile.db.models import Product


# Create your views here.
class ProductViewSet(BaseViewSet):
    model = Product
    serializer_class = ProductListSerializer

    search_fields = ['name']
    filterset_fields = ['type__slug', 'shop_id', 'categories__slug']

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
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer.save()

        output = self.serializer_class(product, context={"request": request}).data
        return Response(output, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        product = Product.objects.get(slug=kwargs["slug"])

        serializer = ProductSerializer(
            product,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        output = self.serializer_class(product, context={"request": request}).data
        return Response(output, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class DraftProductViewSet(BaseViewSet):
    model = Product
    serializer_class = ProductListSerializer

    search_fields = ['name']
    filterset_fields = ['type__slug', 'shop_id', 'status']

    lookup_field = "slug"

    def get_queryset(self):
        return (
            self.filter_queryset(super().get_queryset())
        )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class LowStockProductViewSet(BaseViewSet):
    model = Product
    serializer_class = ProductListSerializer

    search_fields = ['name']
    filterset_fields = ['type__slug', 'shop_id', 'status']

    lookup_field = "slug"

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.filter(quantity__lt=10)
        return self.filter_queryset(queryset)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
