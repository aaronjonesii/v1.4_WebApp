from rest_framework import viewsets, permissions
from ..serializers import CryptoWalletSerializer
from ..models import CryptoWallet, WalletStatus

from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q


class CryptoWalletViewSet(viewsets.ModelViewSet):
    """CRUD endpoint for Crypto Wallets"""
    serializer_class = CryptoWalletSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        """
            Return all Crypto Wallets created from the user
        """
        user = self.request.user
        return CryptoWallet.objects.filter(creator=user)

    def perform_create(self, serializer):
        # Assign crypto wallet to token
        serializer.save(creator=self.request.user)

    def perform_destroy(self, instance):
        # Move crypto wallet to Trash instead of full delete
        instance.status = WalletStatus.TRASH.value
        instance.save(update_fields=['status'])

    @action(detail=False)
    def exclude_wallets(self, request, *args, **kwargs):
        """
            Return all crypto wallets created by the user
            while excluding tokens that are WalletStatus.TRASH OR WalletStatus.ARCHIVE
        """
        all_wallets = CryptoWallet.objects \
            .exclude(Q(status=WalletStatus.ARCHIVE.value) | Q(status=WalletStatus.TRASH.value)) \
            .filter(creator=self.request.user)
        serializer = CryptoWalletSerializer(all_wallets, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def trashed_wallets(self, request, *args, **kwargs):
        """
            Return all crypto wallets created from the user
            that are WalletStatus.TRASH
        """
        trashed_tokens = CryptoWallet.objects \
            .filter(Q(creator=self.request.user),
                    Q(status=WalletStatus.TRASH.value))
        serializer = CryptoWalletSerializer(trashed_tokens, many=True)
        return Response(serializer.data)

    @action(detail=False)
    def archived_wallets(self, request, *args, **kwargs):
        """
            Return all crypto wallets created from the user
            that are WalletsStatus.ARCHIVE
        """
        archived_tokens = CryptoWallet.objects \
            .filter(Q(creator=self.request.user),
                    Q(status=WalletStatus.ARCHIVE.value))
        serializer = CryptoWalletSerializer(archived_tokens, many=True)
        return Response(serializer.data)
