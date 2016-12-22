from django.contrib.auth import authenticate, login
from django.shortcuts import render

def index(request):
    u = 'patrick'
    p = 'nicelittlebirds'
    login(username=u, password=p)
    return render(request, 'registry/index.html')
