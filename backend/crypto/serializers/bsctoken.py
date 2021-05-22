from rest_framework import serializers
from ..models import CryptoToken, TokenBlockChain, TokenStatus, TokenSocials, SwapTransaction, Tag
from .socials import SocialsSerializer
from .swaptransaction import SwapTransactionHashSerializer
from .tag import TagSerializer


def create_tags(tags, token_instance):
    """
    Check for tag existence and assign to tokens, respectively.
    """
    for tag in tags:
        if Tag.objects.filter(name=tag['name']).exists():
            existing_tag = Tag.objects.filter(name=tag['name']).first()
            existing_tag.tokens.add(token_instance)
        else:
            new_tag = Tag.objects.create(**tag)
            new_tag.posts.add(token_instance)


def update_token_fields(new_token_data, instance):
    instance.blockchain = new_token_data.get('blockchain', instance.blockchain)
    instance.name = new_token_data.get('name', instance.name)
    instance.symbol = new_token_data.get('symbol', instance.symbol)
    instance.contract_address = new_token_data.get('contract_address', instance.contract_address)
    instance.launch_date = new_token_data.get('launch_date', instance.launch_date)
    instance.description = new_token_data.get('description', instance.description)
    instance.website = new_token_data.get('website', instance.website)
    instance.whitepaper = new_token_data.get('whitepaper', instance.whitepaper)
    instance.socials = new_token_data.get('socials', instance.socials)
    # instance.swaps = new_post_data.get('swaps', instance.swaps)
    instance.is_flagged = new_token_data.get('is_flagged', instance.is_flagged)
    # instance.balance = new_post_data.get('balance', instance.balance)
    instance.status = new_token_data.get('status', instance.status)


def update_tags(update_tags, token_instance):
    keep_tags = []
    for tag in update_tags:
        if Tag.objects.filter(name=tag.get('name')).exists():
            existing_tag = Tag.objects.filter(name=tag.get('name')).first()
            if not token_instance.tags.filter(name=tag.get('name')):
                existing_tag.tokens.add(token_instance)
            keep_tags.append(existing_tag.name)
        else:
            new_tag = Tag.objects.create(**tag)
            new_tag.tokens.add(token_instance)
            keep_tags.append(new_tag.name)
    for old_tag in token_instance.tags:
        if old_tag.name not in keep_tags:
            token_instance.tag_set.remove(old_tag)


def update_token_socials(new_token_socials_data, instance):
    TokenSocials.objects.filter(id=instance.socials.id).update(**new_token_socials_data)


class CryptoTokenSerializer(serializers.ModelSerializer):
    blockchain = serializers.ChoiceField(choices=TokenBlockChain.choices, required=True)
    status = serializers.ChoiceField(choices=TokenStatus.choices, required=True)
    socials = SocialsSerializer(required=False, allow_null=True)
    swaps = serializers.SerializerMethodField('get_all_swaps')
    tags = TagSerializer(many=True, required=False)

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
                  'swaps', 'is_flagged', 'balance', 'status', 'tags']
        extra_kwargs = {
            "swaps_to_token": {"required": False},
            "swaps_from_token": {"required": False},
        }

    def create(self, validated_data):
        socials_exist, swap_transactions_exists, tags_exists = False, False, False
        if 'tags' in validated_data:
            tags = validated_data.pop('tags')
            tags_exists = True
        if 'socials' in validated_data:
            socials = validated_data.pop('socials')
            socials_exist = True
        if 'swaps' in validated_data:
            swap_transactions = validated_data.pop('swaps')
            swap_transactions_exists = True
        token = CryptoToken.objects.create(**validated_data)
        if tags_exists: create_tags(tags, token)
        if socials_exist: add_socials_to_bsctoken(socials, token)
        if swap_transactions_exists: add_swap_transactions_to_bsctoken(swap_transactions, token)
        return token

    def update(self, instance, validated_data):
        if 'tags' in validated_data:
            new_token_tags = validated_data.pop('tags')
        if 'socials' in validated_data:
            new_token_socials = validated_data.pop('socials')
        if 'swaps' in validated_data:
            new_swaps = validated_data.pop('swaps')
        if 'swaps_from_token' in validated_data:
            new_swaps_from_token = validated_data.pop('swaps_from_token')
        if 'swaps_to_token' in validated_data:
            new_swaps_to_token = validated_data.pop('swaps_to_token')
        update_token_fields(validated_data, instance)
        update_tags(new_token_tags, instance)
        update_token_socials(new_token_socials, instance)
        instance.save()
        return instance


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
