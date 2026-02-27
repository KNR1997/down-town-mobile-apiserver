from downTownMobile.app.serializers.product import ProductListSerializer
from downTownMobile.app.views.base import BaseViewSet
from downTownMobile.db.models import Product


# Create your views here.
class DraftProductViewSet(BaseViewSet):
    model = Product
    serializer_class = ProductListSerializer

    search_fields = ['name']
    filterset_fields = ['type__slug']

    lookup_field = "slug"

    def get_queryset(self):
        return (
            self.filter_queryset(super().get_queryset().filter(status="draft"))
        )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
