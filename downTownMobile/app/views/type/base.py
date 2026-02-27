from rest_framework import status
from rest_framework.response import Response

from downTownMobile.app.serializers.type import TypeListSerializer
from downTownMobile.app.views.base import BaseViewSet
from downTownMobile.db.models import Type


# Create your views here.
class TypeViewSet(BaseViewSet):
    model = Type
    serializer_class = TypeListSerializer

    search_fields = []
    filterset_fields = []

    lookup_field = "slug"

    def get_queryset(self):
        return (
            self.filter_queryset(super().get_queryset())
        )

    def list(self, request, *args, **kwargs):
        types = Type.objects.all()
        serializer = TypeListSerializer(types, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
