from rest_framework import permissions
from rest_framework import viewsets
from ..models import BSCToken, SwapTransaction
from ..serializers import BSCTokenSerializer, SwapTransactionSerializer


class BSCTokenViewSet(viewsets.ModelViewSet):
    """CRUD endpoint for Binance Smart Chain Tokens"""
    serializer_class = BSCTokenSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return BSCToken.objects.filter(creator=user)

    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)


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
