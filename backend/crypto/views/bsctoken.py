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
        user = self.request.user
        return CryptoToken.objects.filter(creator=user)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)

    @action(detail=False)
    def bsc_tokens(self, request, *args, **kwargs):
        bsc_tokens = CryptoToken.objects.filter(Q(creator=self.request.user),
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
