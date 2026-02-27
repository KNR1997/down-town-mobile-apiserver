from rest_framework import status
from rest_framework.response import Response

from downTownMobile.app.serializers.customer import CustomerListSerializer, CustomerSerializer
from downTownMobile.app.views.base import BaseViewSet
from downTownMobile.db.models import Customer


# Create your views here.
class CustomerViewSet(BaseViewSet):
    model = Customer
    serializer_class = CustomerListSerializer

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
        serializer = CustomerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        customer = serializer.save()

        output = self.serializer_class(customer, context={"request": request}).data
        return Response(output, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        customer = Customer.objects.get(slug=kwargs["slug"])

        serializer = CustomerSerializer(
            customer,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        customer = serializer.save()

        output = self.serializer_class(customer, context={"request": request}).data
        return Response(output, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
