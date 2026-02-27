from .attribute import urlpatterns as attribute_urls
from .author import urlpatterns as author_urls
from .category import urlpatterns as category_urls
from .customer import urlpatterns as customer_urls
from .manufacturer import urlpatterns as manufacturer_urls
from .product import urlpatterns as product_urls
from .settings import urlpatterns as settings_urls
from .shop import urlpatterns as shop_urls
from .tag import urlpatterns as tag_urls
from .type import urlpatterns as type_urls
from .user import urlpatterns as user_urls

urlpatterns = [
    *attribute_urls,
    *author_urls,
    *category_urls,
    *manufacturer_urls,
    *product_urls,
    *settings_urls,
    *tag_urls,
    *type_urls,
    *user_urls,
    *shop_urls,
    *customer_urls,
]
