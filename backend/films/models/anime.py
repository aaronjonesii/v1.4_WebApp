from django.db import models


class Anime(models.Model):
    _id = models.CharField(max_length=20, primary_key=True)
    mal_id = models.CharField(max_length=10)
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    slug = models.CharField(max_length=150)
    synopsis = models.TextField()
    runtime = models.CharField(max_length=4)
    status = models.CharField(max_length=16)
    type = models.CharField(max_length=6)
    last_updated = models.FloatField(max_length=16)
    episodes = models.TextField()
    genres = models.CharField(max_length=255)
    images = models.TextField()
    latest_episode = models.FloatField(max_length=10)
    rating = models.CharField(max_length=255)
    num_seasons = models.PositiveSmallIntegerField()
    _v = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "Anime Show"
        verbose_name_plural = "Anime Shows"

    def __str__(self):
        return self.title
