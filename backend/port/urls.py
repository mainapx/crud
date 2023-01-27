from django.contrib import admin
from django.urls import path,re_path
from systems import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('user/api/new',views.RegisterHandler.as_view()),
    path('user/api/login',views.LoginHandler.as_view()),
    path('logout',views.LogoutHandler.as_view()),
    path("login",views.LoginView.as_view()),
    path("admin",views.AdminHanlder.as_view()),
    path("register",views.RegisterView.as_view()),
    #rest api urls
    path("get/<int:id>",views.SingleTodoParser),
    path("getall/",views.MultiTodoParser),
    path("create/<int:id>",views.CreateTodoHandler),
    path("put/<int:id>",views.PutTodoHandler),
    path("delete/<int:id>",views.DeleteTodoHandler),
    re_path(r'^(?:.*)/?$',views.IndexHandler.as_view())
]
