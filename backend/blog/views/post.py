from rest_framework import permissions
from rest_framework import viewsets, renderers
from rest_framework.decorators import action
from rest_framework.response import Response


from ..serializers import PostSerializer, TagSerializer, CategorySerializer, PublicPostSerializer
from ..models import Post, Tag, Category
from .auth0 import is_frontend_admin


class PostViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoint for blogging platform.
    """
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return Post.objects.order_by('-updated_on').filter(author=user)

    @action(detail=True, renderer_classes=[renderers.StaticHTMLRenderer])
    def byline(self, request, *args, **kwargs):
        post = self.get_object()
        return Response(post.byline)

    @action(detail=True)
    def tags(self, request, *args, **kwargs):
        post = self.get_object()
        serializer = TagSerializer(post.tags, many=True)
        return Response(serializer.data)

    @action(detail=True)
    def related_posts(self, request, *args, **kwargs):
        post = self.get_object()
        related_posts = []
        for tag in post.tags:
            related_posts_from_tag = Post.objects.filter(tag__name=tag)
            for related_post in related_posts_from_tag:
                if post != related_post and related_post not in related_posts:
                    related_posts.append(related_post)
        # print(f'Post: {post} \nRelated posts: {related_posts}')
        serializer = PostSerializer(related_posts, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PublicPostViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoint for public posts.
    """
    serializer_class = PublicPostSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        return Post.objects.order_by('-updated_on').filter(public=True)


class TagViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoint for story tags.
    """
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = (permissions.IsAuthenticated,)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    CRUD endpoint for categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = (permissions.IsAuthenticated,)


class IsFrontendAdmin(permissions.BasePermission):
    """
    Global permission check for frontend admin
    """
    message = 'You lack valid authentication credentials for the target resource.'
    code = 401

    def has_permission(self, request, view):
        user_id = request.user
        return is_frontend_admin(user_id)


class AdminPostViewSet(viewsets.ModelViewSet):
    """
        CRUD endpoint for frontend admin posts.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = (permissions.IsAuthenticated, IsFrontendAdmin)
