from django.contrib import admin
from .models import Post, Category, Status, Tag, NewsletterSubscriber

admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Status)
admin.site.register(Tag)
admin.site.register(NewsletterSubscriber)
