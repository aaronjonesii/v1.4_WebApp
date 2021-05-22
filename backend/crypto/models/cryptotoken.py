from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
import uuid


class TokenBlockChain(models.TextChoices):
    BITCOIN_BLOCKCHAIN = 'BTC', 'Bitcoin Blockchain'
    CARDANO_BLOCKCHAIN = 'ADA', 'Cardano Blockchain'
    ETHEREUM_BLOCKCHAIN = 'ETH', 'Ethereum Blockchain'
    BITCOIN_CASH_BLOCKCHAIN = 'BCH', 'Bitcoin Cash Blockchain'
    BINANCE_CHAIN_BLOCKCHAIN = 'BNB-BEP2', 'Binance Chain Blockchain'
    BINANCE_SMART_CHAIN_BLOCKCHAIN = 'BNB-BEP20', 'Binance Smart Chain Blockchain'
    UNKNOWN = 'UNKNOWN', 'Unknown Blockchain'


class TokenStatus(models.TextChoices):
    PUBLIC = 'PUBLIC', 'Public'  # Viewable by everyone.
    PRIVATE = 'PRIVATE', 'Private'  # Viewable only by creator
    TRASH = 'TRASH', 'Trash'  # Trashed
    ARCHIVE = 'ARCHIVE', 'Archive'  # Archived


class CryptoToken(models.Model):
    """Cryptocurrency Token"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    creator = models.ForeignKey(settings.AUTH_USER_MODEL,
                                on_delete=models.PROTECT,
                                help_text="User who created the BSCToken.")
    blockchain = models.CharField(max_length=9, choices=TokenBlockChain.choices, default=TokenBlockChain.UNKNOWN)
    name = models.CharField('project name', max_length=80, help_text='Project name')
    symbol = models.CharField('token symbol', max_length=20, help_text='Token symbol', blank=True)
    contract_address = models.CharField(max_length=42, help_text='Contract address', blank=True)
    launch_date = models.DateTimeField(help_text='Project launch date, format: YYYY-MM-DD HH:MM:SS', blank=True, null=True)
    description = models.TextField('project description', help_text='Projects purpose or future details', blank=True)
    website = models.URLField('project website', help_text='Project website URL link', blank=True)
    whitepaper = models.URLField('project whitepaper', help_text='Project whitepaper URL link', blank=True)
    socials = models.ForeignKey('TokenSocials', on_delete=models.CASCADE, blank=True, db_column='socials', null=True)
    swaps = models.ManyToManyField('SwapTransaction', blank=True)
    is_flagged = models.BooleanField('flagged', default=False, help_text='Designates whether the token is flagged.')
    balance = models.FloatField(help_text='Amount of tokens in wallets', default=0, blank=True)
    status = models.CharField(max_length=7, choices=TokenStatus.choices, default=TokenStatus.PRIVATE)
    # TODO: Add tags fields

    class Meta:
        verbose_name = 'Cryptocurrency Token'
        verbose_name_plural = 'Cryptocurrency Tokens'

    def __str__(self):
        return self.name

    @property
    def tags(self):
        return self.tag_set.all()


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, blank=False)
    tokens = models.ManyToManyField(CryptoToken, blank=True)

    class Meta:
        verbose_name = "Token Tag"
        verbose_name_plural = "Token Tags"

    def __str__(self):
        return self.name
