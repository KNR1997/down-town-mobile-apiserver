from django.db import IntegrityError
from django.utils.text import slugify
from downTownMobile.app.serializers.attribute import AttributeListSerializer, AttributeSerializer
from downTownMobile.app.views.base import BaseViewSet
from downTownMobile.db.models import Attribute
from rest_framework import status
from rest_framework.response import Response


# Create your views here.
class AttributeViewSet(BaseViewSet):
    model = Attribute
    serializer_class = AttributeListSerializer

    search_fields = []
    filterset_fields = []

    lookup_field = "slug"

    def get_queryset(self):
        return (
            self.filter_queryset(super().get_queryset())
        )

    def list(self, request, *args, **kwargs):
        attributes = Attribute.objects.all()
        serializer = AttributeListSerializer(attributes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        try:
            if Attribute.objects.filter(
                    slug=slugify(request.data.get('name'))
            ).exists():
                return Response(
                    {"name": "The attribute with the name already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = AttributeSerializer(data=request.data)

            if serializer.is_valid():
                serializer.save()
                attribute = self.get_queryset().filter(pk=serializer.data["id"]).first()
                serializer = AttributeListSerializer(attribute)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError as e:
            if "already exists" in str(e):
                return Response(
                    {"slug": "The attribute with the slug already exists"},
                    status=status.HTTP_409_CONFLICT,
                )

    def update(self, request, *args, **kwargs):
        try:
            attribute = Attribute.objects.get(slug=kwargs['slug'])
            if attribute.name != request.data.get('name'):
                if Attribute.objects.filter(
                        slug=slugify(request.data.get('name'))
                ).exists():
                    return Response(
                        {"name": "The attribute with the name already exists"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            serializer = AttributeSerializer(
                attribute,
                data=request.data,
                partial=True,
            )

            if serializer.is_valid():
                serializer.save()
                attribute = self.get_queryset().filter(pk=attribute.id).first()
                serializer = AttributeListSerializer(attribute)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except IntegrityError as e:
            if "already exists" in str(e):
                return Response(
                    {"slug": "The attribute with the slug already exists"},
                    status=status.HTTP_409_CONFLICT,
                )

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
