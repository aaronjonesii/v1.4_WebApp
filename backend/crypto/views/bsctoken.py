from rest_framework import viewsets
from ..models import BSCToken, SwapTransaction
from ..serializers import BSCTokenSerializer, SwapTransactionSerializer


class BSCTokenViewSet(viewsets.ModelViewSet):
    """CRUD endpoint for Binance Smart Chain Tokens"""
    queryset = BSCToken.objects.all()
    serializer_class = BSCTokenSerializer


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
