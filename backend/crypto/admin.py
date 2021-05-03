from django.contrib import admin
from .models import BSCToken, SwapTransaction, TokenSocials

# Register your models here.
admin.site.register(BSCToken)
admin.site.register(SwapTransaction)
admin.site.register(TokenSocials)
