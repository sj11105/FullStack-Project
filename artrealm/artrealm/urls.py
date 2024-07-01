"""artrealm URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# showcase/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from showcase.views import ArtworkViewSet, CommentViewSet, RatingViewSet, UserProfileViewSet, register_user


router = DefaultRouter()
router.register(r'artworks', ArtworkViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'ratings', RatingViewSet)
router.register(r'userprofiles', UserProfileViewSet)


urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
     path('api/register/', register_user, name='register_user'),
]

