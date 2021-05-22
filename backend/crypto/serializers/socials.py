from rest_framework import serializers
from ..models import TokenSocials


class SocialsSerializer(serializers.ModelSerializer):
    class Meta:
        model = TokenSocials
        fields = ['email', 'blog', 'reddit', 'facebook', 'twitter', 'github',
                  'telegram', 'linkedin', 'discord', 'instagram', 'youtube']
