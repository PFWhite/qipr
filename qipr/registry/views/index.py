from django.contrib.auth import authenticate, login
from django.shortcuts import render

def index(request):
    u = 'patrick'
    p = 'nicelittlebirds'
    user = authenticate(username=u, password=p)
    if user is not None:
        login(request, user)
    return render(request, 'registry/index.html')
