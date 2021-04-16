# Generated by Django 3.1.7 on 2021-04-16 05:55

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Anime',
            fields=[
                ('_id', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('mal_id', models.CharField(max_length=10)),
                ('title', models.CharField(max_length=255)),
                ('year', models.CharField(max_length=4)),
                ('slug', models.CharField(max_length=150)),
                ('synopsis', models.TextField()),
                ('runtime', models.CharField(max_length=4)),
                ('status', models.CharField(max_length=16)),
                ('type', models.CharField(max_length=6)),
                ('last_updated', models.FloatField(max_length=16)),
                ('episodes', models.TextField()),
                ('genres', models.CharField(max_length=255)),
                ('images', models.TextField()),
                ('latest_episode', models.FloatField(max_length=10)),
                ('rating', models.CharField(max_length=255)),
                ('num_seasons', models.PositiveSmallIntegerField()),
                ('_v', models.PositiveSmallIntegerField()),
            ],
            options={
                'verbose_name': 'Anime Show',
                'verbose_name_plural': 'Anime Shows',
            },
        ),
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('_id', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('imdb_id', models.CharField(max_length=10)),
                ('title', models.CharField(max_length=255)),
                ('year', models.CharField(max_length=4)),
                ('slug', models.CharField(max_length=150)),
                ('synopsis', models.TextField()),
                ('runtime', models.CharField(max_length=4)),
                ('country', models.CharField(max_length=4)),
                ('last_updated', models.FloatField(max_length=16)),
                ('released', models.IntegerField()),
                ('certification', models.CharField(max_length=255)),
                ('torrents', models.TextField()),
                ('trailer', models.CharField(max_length=255)),
                ('genres', models.CharField(max_length=255)),
                ('images', models.TextField()),
                ('rating', models.CharField(max_length=255)),
                ('_v', models.PositiveSmallIntegerField()),
            ],
            options={
                'verbose_name': 'Movie',
                'verbose_name_plural': 'Movies',
            },
        ),
        migrations.CreateModel(
            name='Show',
            fields=[
                ('_id', models.CharField(max_length=20, primary_key=True, serialize=False)),
                ('imdb_id', models.CharField(max_length=10)),
                ('tvdb_id', models.CharField(max_length=10)),
                ('title', models.CharField(max_length=255)),
                ('year', models.CharField(max_length=4)),
                ('slug', models.CharField(max_length=150)),
                ('synopsis', models.TextField()),
                ('runtime', models.CharField(max_length=4)),
                ('country', models.CharField(max_length=4)),
                ('network', models.CharField(max_length=30)),
                ('air_day', models.CharField(max_length=9)),
                ('air_time', models.CharField(max_length=5)),
                ('status', models.CharField(max_length=16)),
                ('num_seasons', models.PositiveSmallIntegerField()),
                ('last_updated', models.FloatField(max_length=16)),
                ('episodes', models.TextField()),
                ('latest_episode', models.FloatField(max_length=10)),
                ('genres', models.CharField(max_length=255)),
                ('images', models.TextField()),
                ('rating', models.CharField(max_length=255)),
                ('_v', models.PositiveSmallIntegerField()),
            ],
            options={
                'verbose_name': 'TV Show',
                'verbose_name_plural': 'TV Shows',
            },
        ),
    ]
