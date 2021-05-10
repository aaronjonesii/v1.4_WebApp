from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Post, Category, Status, Tag, NewsletterSubscriber


class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (                      # new fieldset added on to the top
            'Frontend Permissions',  # group heading of your choice; set to None for a blank space instead of a header
            {'fields': ('is_frontend_admin',)},
        ),
        ('', {'fields': ()}),
        *UserAdmin.fieldsets,  # original form fieldsets, expanded
    )
    list_display = ('username', 'email', 'is_frontend_admin', 'is_staff')


admin.site.register(User, CustomUserAdmin)
admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Status)
admin.site.register(Tag)
admin.site.register(NewsletterSubscriber)
