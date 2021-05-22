from rest_framework import permissions
from rest_framework import viewsets
from ..models import CryptoToken, SwapTransaction, TokenBlockChain, TokenStatus, Tag
from ..serializers import CryptoTokenSerializer, SwapTransactionSerializer, TagSerializer

from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q


class CryptoTokenViewSet(viewsets.ModelViewSet):
    """CRUD endpoint for Binance Smart Chain Tokens"""
    serializer_class = CryptoTokenSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """
            Return all Tokens created from the user
            while excluding tokens that are TokenStatus.TRASH
        """
        user = self.request.user
        return CryptoToken.objects.exclude(status=TokenStatus.TRASH.value).filter(creator=user)

    def perform_create(self, serializer):
        # Assign user to token
        serializer.save(creator=self.request.user)

    def perform_destroy(self, instance):
        # Move Token to Trash instead of full delete
        instance.status = TokenStatus.TRASH.value
        instance.save(update_fields=['status'])

    @action(detail=False)
    def bsc_tokens(self, request, *args, **kwargs):
        """
            Return all Tokens created from the user
            that are  TokenBlockChain.BINANCE_SMART_CHAIN_BLOCKCHAIN
            also excluding tokens that are TokenStatus.TRASH
        """
        bsc_tokens = CryptoToken.objects.exclude(
            status=TokenStatus.TRASH.value
        ).filter(
            Q(creator=self.request.user),
            Q(blockchain=TokenBlockChain.BINANCE_SMART_CHAIN_BLOCKCHAIN.value)
        )
        serializer = CryptoTokenSerializer(bsc_tokens, many=True)
        return Response(serializer.data)


class SwapTransactionsViewSet(viewsets.ModelViewSet):
    """CRUD endpoint for Swap Transactions"""
    queryset = SwapTransaction.objects.order_by('-timestamp')
    serializer_class = SwapTransactionSerializer

    def get_serializer(self, *args, **kwargs):
        if "data" in kwargs:
            data = kwargs["data"]
            if isinstance(data, list):
                kwargs["many"] = True
        return super(SwapTransactionsViewSet, self).get_serializer(*args, **kwargs)


class TagViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoint for token tags.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (permissions.IsAuthenticated,)
