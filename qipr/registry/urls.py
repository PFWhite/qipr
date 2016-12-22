from django.conf.urls import url
from django.contrib.auth import views as auth_views
import oauth2_provider.views as oauth2_views
from registry import views
from registry import api

urlpatterns = [
    url(r'^search/(?:d=(?P<descriptors_json>\[.*\])/)?$', views.search, name='search'),
    url(r'^project_info/(?P<project_id>[0-9]+)/$',views.project_info, name='project_info'),
    url(r'^$',views.index, name='index'),
    url(r'^api/add_model$', api.add_model, name='add_model'),
    url(r'^accounts/login/$', auth_views.login),
    url(r'^api/authorize/$', oauth2_views.AuthorizationView.as_view(), name="authorize"),
    url(r'^api/token/$', oauth2_views.TokenView.as_view(), name="token"),
    url(r'^api/revoke-token/$', oauth2_views.RevokeTokenView.as_view(), name="revoke-token"),
]
