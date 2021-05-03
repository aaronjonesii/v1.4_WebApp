from django.db import models


class BSCToken(models.Model):
    """Binance Smart Chain Token"""
    name = models.CharField('project name', max_length=80, help_text='Project name')
    symbol = models.CharField('token symbol', max_length=20, help_text='Token symbol')
    contract_address = models.CharField(primary_key=True, max_length=42, help_text='Contract address', unique=True)
    launch_date = models.DateTimeField(help_text='Project launch date, format: YYYY-MM-DD HH:MM:SS', blank=True, null=True)
    website = models.URLField('project website', blank=True, help_text='Project website URL link')
    description = models.TextField('project description', help_text='Projects purpose or future details', blank=True)
    whitepaper = models.URLField('project whitepaper', blank=True, help_text='Project whitepaper URL link')
    socials = models.ForeignKey('TokenSocials', on_delete=models.CASCADE, blank=True, db_column='socials', null=True)
    swaps = models.ManyToManyField('SwapTransaction')

    class Meta:
        verbose_name = 'Binance Smart Chain Token'
        verbose_name_plural = 'Binance Smart Chain Tokens'

    def __str__(self):
        return self.name
