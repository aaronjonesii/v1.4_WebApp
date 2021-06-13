from rest_framework import serializers
from ..models import CryptoWallet, WalletStatus
from web3 import Web3


def is_ethereum_address(wallet_address):
    infura_url = 'https://mainnet.infura.io/v3/6dac472c6b9147188a752a9200911ccd'
    web3 = Web3(Web3.HTTPProvider(infura_url))
    return web3.isAddress(str(wallet_address))


class CryptoWalletSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(choices=WalletStatus.choices, required=True)

    def validate(self, data):
        """Check if wallet address is valid"""
        address_valid = is_ethereum_address(data['address'])
        if not address_valid:
            raise serializers.ValidationError(
                {"address": "Wallet address must be a valid ethereum address."})
        return data

    class Meta:
        model = CryptoWallet
        fields = ['name', 'description', 'address', 'status']
