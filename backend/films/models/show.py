from django.db import models


class Show(models.Model):
    _id = models.CharField(max_length=20, primary_key=True)
    imdb_id = models.CharField(max_length=10)
    tvdb_id = models.CharField(max_length=10)
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    slug = models.CharField(max_length=150)
    synopsis = models.TextField()
    runtime = models.CharField(max_length=4)
    country = models.CharField(max_length=4)
    network = models.CharField(max_length=30)
    air_day = models.CharField(max_length=9)
    air_time = models.CharField(max_length=5)
    status = models.CharField(max_length=16)
    num_seasons = models.PositiveSmallIntegerField()
    last_updated = models.FloatField(max_length=16)
    episodes = models.TextField()
    latest_episode = models.FloatField(max_length=10)
    genres = models.CharField(max_length=255)
    images = models.TextField()
    rating = models.CharField(max_length=255)
    _v = models.PositiveSmallIntegerField()

    class Meta:
        verbose_name = "TV Show"
        verbose_name_plural = "TV Shows"

    def __str__(self):
        return self.title
