from django.contrib import admin
from .models import CryptoToken,\
    SwapTransaction, TokenSocials, Tag, CryptoWallet


# Register your models here.
admin.site.register(CryptoToken)
admin.site.register(SwapTransaction)
admin.site.register(TokenSocials)
admin.site.register(Tag)
admin.site.register(CryptoWallet)
