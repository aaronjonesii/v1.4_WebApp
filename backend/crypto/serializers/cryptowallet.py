from rest_framework import serializers
from ..models import CryptoWallet, WalletStatus


class CryptoWalletSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=WalletStatus.choices, required=True)

    class Meta:
        model = CryptoWallet
        fields = ['name', 'description', 'address', 'status']
