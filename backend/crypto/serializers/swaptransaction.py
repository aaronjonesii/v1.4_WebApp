from rest_framework import serializers
from ..models import SwapTransaction, CryptoToken


class SwapTransactionSerializer(serializers.ModelSerializer):
    from_token = serializers.SlugRelatedField(slug_field='symbol', queryset=CryptoToken.objects.all())
    to_token = serializers.SlugRelatedField(slug_field='symbol', queryset=CryptoToken.objects.all())

    def __init__(self, *args, **kwargs):
        many = kwargs.pop('many', True)
        super(SwapTransactionSerializer, self).__init__(many=many, *args, **kwargs)

    class Meta:
        model = SwapTransaction
        fields = '__all__'


class SwapTransactionHashSerializer(serializers.ModelSerializer):

    def __init__(self, *args, **kwargs):
        many = kwargs.pop('many', True)
        super(SwapTransactionHashSerializer, self).__init__(many=many, *args, **kwargs)

    class Meta:
        model = SwapTransaction
        fields = ['hash']
