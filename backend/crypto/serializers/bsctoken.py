from rest_framework import serializers
from ..models.cryptotoken import CryptoToken, TokenBlockChain, TokenStatus
from ..models import TokenSocials
from ..models import SwapTransaction
from .socials import SocialsSerializer
from .swaptransaction import SwapTransactionHashSerializer


class CryptoTokenSerializer(serializers.ModelSerializer):
    blockchain = serializers.ChoiceField(choices=TokenBlockChain.choices, required=True)
    status = serializers.ChoiceField(choices=TokenStatus.choices, required=True)
    socials = SocialsSerializer(required=False, allow_null=True)
    swaps = serializers.SerializerMethodField('get_all_swaps')

    def get_all_swaps(self, token):
        swaps_from_token = token.swaps_from_token.all().values()
        serializer_swaps_from_token = SwapTransactionHashSerializer(swaps_from_token, many=True)
        swaps_to_token = token.swaps_to_token.all().values()
        serializer_swaps_to_token = SwapTransactionHashSerializer(swaps_to_token, many=True)
        return serializer_swaps_from_token.data + serializer_swaps_to_token.data

    class Meta:
        model = CryptoToken
        fields = ['id', 'blockchain', 'name', 'symbol', 'contract_address',
                  'launch_date', 'description', 'website', 'whitepaper',
                  'socials', 'swaps_to_token', 'swaps_from_token',
                  'swaps', 'is_flagged', 'balance', 'status']
        extra_kwargs = {
            "swaps_to_token": {"required": False},
            "swaps_from_token": {"required": False},
        }

    def create(self, validated_data):
        socials_exist = False; swap_transactions_exists = False
        if 'socials' in validated_data:
            socials = validated_data.pop('socials')
            socials_exist = True
        if 'swaps' in validated_data:
            swap_transactions = validated_data.pop('swaps')
            swap_transactions_exists = True
        bsctoken = CryptoToken.objects.create(**validated_data)
        if socials_exist: add_socials_to_bsctoken(socials, bsctoken)
        if swap_transactions_exists: add_swap_transactions_to_bsctoken(swap_transactions, bsctoken)
        return bsctoken


def add_socials_to_bsctoken(socials, bsctoken_instance):
    new_socials = TokenSocials.objects.create(token=bsctoken_instance, **socials)
    new_socials.cryptotoken_set.add(bsctoken_instance)


def add_swap_transactions_to_bsctoken(swap_transactions, bsctoken_instance):
    for swap_transaction in swap_transactions:
        if SwapTransaction.objects.filter(hash=swap_transaction['hash']).exists():
            existing_swap_transaction = SwapTransaction.objects.filter(hash=swap_transaction['hash']).first()
            existing_swap_transaction.tokens.add(bsctoken_instance)
        else:
            new_swap_transaction = SwapTransaction.objects.create(**swap_transaction)
            new_swap_transaction.tokens.add(bsctoken_instance)