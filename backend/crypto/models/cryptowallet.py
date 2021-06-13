from django.db import models
from django.conf import settings
import uuid


class WalletStatus(models.TextChoices):
    PRIVATE = 'PRIVATE', 'Private'  # Viewable only by creator
    TRASH = 'TRASH', 'Trash'  # Trashed
    ARCHIVE = 'ARCHIVE', 'Archive'  # Archived


class CryptoWallet(models.Model):
    """Cryptocurrency Wallet"""
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.PROTECT,
                                help_text="User who created the Crypto Wallet.")
    name = models.CharField('wallet name', max_length=50, help_text='Name of Crypto Wallet')
    description = models.CharField('wallet description', max_length=255, help_text='Crypto Wallet Description', blank=True)
    address = models.CharField('wallet address', max_length=42, help_text='Crypto Wallet Address', primary_key=True)
    status = models.CharField(max_length=7, choices=WalletStatus.choices, default=WalletStatus.PRIVATE)

    class Meta:
        verbose_name = 'Cryptocurrency Wallet'
        verbose_name_plural = 'Cryptocurrency Wallets'

    def __str__(self):
        return self.name
