from rest_framework import status
from rest_framework.response import Response

from downTownMobile.app.serializers.warehouse import WarehouseListSerializer, WarehouseSerializer
from downTownMobile.app.views.base import BaseViewSet
from downTownMobile.db.models import Warehouse


# Create your views here.
class WarehouseViewSet(BaseViewSet):
    model = Warehouse
    serializer_class = WarehouseListSerializer

    search_fields = ['name']
    filterset_fields = []

    def get_queryset(self):
        return (
            self.filter_queryset(super().get_queryset())
        )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = WarehouseSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        warehouse = serializer.save()

        output = self.serializer_class(warehouse, context={"request": request}).data
        return Response(output, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        warehouse = Warehouse.objects.get(pk=kwargs["pk"])

        serializer = WarehouseSerializer(
            warehouse,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        teacher = serializer.save()

        output = self.serializer_class(teacher, context={"request": request}).data
        return Response(output, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
