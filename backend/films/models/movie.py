from django.db import models


class Movie(models.Model):
    _id = models.CharField(max_length=20, primary_key=True)
    imdb_id = models.CharField(max_length=10)
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=4)
    synopsis = models.TextField()
    runtime = models.CharField(max_length=4)
    released = models.IntegerField()
    certification = models.CharField(max_length=255)
    torrents = models.TextField()
    trailer = models.CharField(max_length=255)
    genres = models.CharField(max_length=255)
    images = models.TextField()
    rating = models.CharField(max_length=255)

    class Meta:
        verbose_name = "Movie"
        verbose_name_plural = "Movies"

    def __str__(self):
        return self.title
