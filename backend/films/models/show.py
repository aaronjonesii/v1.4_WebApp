from django.db import models


class Show(models.Model):
    _id = models.CharField(max_length=20, primary_key=True)
    imdb_id = models.CharField(max_length=10)
    tvdb_id = models.CharField(max_length=10)
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    slug = models.CharField(max_length=150)
    num_seasons = models.PositiveSmallIntegerField()
    images = models.TextField()
    rating = models.CharField(max_length=255)

    class Meta:
        verbose_name = "TV Show"
        verbose_name_plural = "TV Shows"

    def __str__(self):
        return self.title
