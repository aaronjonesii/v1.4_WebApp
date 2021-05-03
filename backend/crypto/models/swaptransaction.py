from django.db import models


class SwapTransaction(models.Model):
    hash = models.CharField('TxHash', primary_key=True, max_length=66, blank=True, unique=True, help_text='Transaction hash')
    timestamp = models.DateTimeField(help_text='Transaction timestamp', blank=True)
    from_token = models.ForeignKey('BSCToken', on_delete=models.PROTECT, related_name='swaps_from_token', db_column='from_token', help_text='Token swapped from', blank=True)
    from_amount = models.FloatField(help_text='Token amount swapped from')
    from_price = models.FloatField(help_text='Token price swapped from', blank=True, null=True)
    to_token = models.ForeignKey('BSCToken', on_delete=models.PROTECT, related_name='swaps_to_token', db_column='to_token', help_text='Token swapped to')
    to_amount = models.FloatField(help_text='Token amount swapped to')
    to_price = models.FloatField(help_text='Token price swapped to', blank=True, null=True)
    fee = models.FloatField('transaction fee', help_text='Amount of BNB paid to miners for swap transaction', blank=True)

    def save(self, *args, **kwargs):
        if self.from_price is not None:
            self.to_price = get_to_price(self.from_price, self.to_amount)
        super(SwapTransaction, self).save(*args, **kwargs)

    class Meta:
        verbose_name = 'Swap Transaction'
        verbose_name_plural = 'Swap Transactions'

    def __str__(self):
        return f'Swapped {self.from_amount} {self.from_token} for {self.to_amount} {self.to_token}'


def get_to_price(from_price, to_amount):
    result = to_amount/from_price
    remainder = from_price % 1
    whole_from_price = from_price - remainder
    percentage_of_remainder = remainder / from_price
    whole_to_amount = to_amount - (to_amount * percentage_of_remainder)
    return whole_to_amount / whole_from_price
