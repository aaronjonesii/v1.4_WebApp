from rest_framework import serializers
from ..models import Tag


class TagSerializer(serializers.ModelSerializer):
    # tokens = serializers.HyperlinkedRelatedField(many=True, required=False, read_only=True, view_name='token-detail')  # Uncomment to enable tokens

    class Meta:
        model = Tag
        # fields = ['name', 'tokens']  # Uncomment to enable tokens
        fields = ['name']
        # read_only_fields = ('tokens',)  # Uncomment to enable tokens
        extra_kwargs = { 'name': {'validators': []}, }  # Bypass unique validator to handle myself
