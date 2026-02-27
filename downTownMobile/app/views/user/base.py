from rest_framework import status
from rest_framework import status
from rest_framework.response import Response

from downTownMobile.app.permissions.base import ROLE
from downTownMobile.app.serializers.tag import TagSerializer
from downTownMobile.app.serializers.user import UserListSerializer, UserSerializer
from downTownMobile.app.views.base import BaseViewSet
from downTownMobile.db.models import Tag, User


# Create your views here.
class UserViewSet(BaseViewSet):
    model = User
    serializer_class = UserListSerializer

    search_fields = ['first_name', 'last_name']
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
        serializer = TagSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        teacher = serializer.save()

        output = self.serializer_class(teacher, context={"request": request}).data
        return Response(output, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        user = User.objects.get(pk=kwargs["pk"])

        serializer = UserSerializer(
            user,
            data=request.data,
            partial=True,
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        output = UserListSerializer(user, context={"request": request}).data
        return Response(output, status=status.HTTP_200_OK)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)


class AdminViewSet(BaseViewSet):
    model = User
    serializer_class = UserListSerializer

    search_fields = []
    filterset_fields = []

    lookup_field = "slug"

    def get_queryset(self):
        return (
            self.filter_queryset(super().get_queryset().filter(role=ROLE.SUPER_ADMIN.value))
        )

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
