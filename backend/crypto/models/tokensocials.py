from django.db import models


class TokenSocials(models.Model):
    token = models.ForeignKey('CryptoToken', on_delete=models.CASCADE, db_column='token')
    email = models.EmailField(blank=True)
    blog = models.URLField(blank=True)
    reddit = models.URLField(blank=True)
    facebook = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    github = models.URLField(blank=True)
    telegram = models.URLField(blank=True)
    linkedin = models.URLField(blank=True)
    discord = models.URLField(blank=True)
    instagram = models.URLField(blank=True)
    youtube = models.URLField(blank=True)

    class Meta:
        verbose_name = 'Socials'
        verbose_name_plural = 'Socials'

    def __str__(self):
        entered_socials = []
        if self.email != '': entered_socials.append('email')
        if self.blog != '': entered_socials.append('blog')
        if self.reddit != '': entered_socials.append('reddit')
        if self.facebook != '': entered_socials.append('facebook')
        if self.twitter != '': entered_socials.append('twitter')
        if self.github != '': entered_socials.append('github')
        if self.telegram != '': entered_socials.append('telegram')
        if self.linkedin != '': entered_socials.append('linkedin')
        if self.discord != '': entered_socials.append('discord')
        if self.instagram != '': entered_socials.append('instagram')
        if self.youtube != '': entered_socials.append('youtube')
        return f'{self.token.name} Social Links({len(entered_socials)})'
