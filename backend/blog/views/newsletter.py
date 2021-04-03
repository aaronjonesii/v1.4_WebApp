from rest_framework import viewsets, views
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from ..serializers import NewsletterSerializer
from ..models import NewsletterSubscriber
from .ip import get_client_ip


class NewsletterSubscription(viewsets.ModelViewSet):
    """
    Subscribe email to newsletter.
    """
    serializer_class = NewsletterSerializer
    queryset = NewsletterSubscriber.objects.all().filter(isactive=True)

    def perform_create(self, serializer):
        email = self.request.data['email']
        queryset = NewsletterSubscriber.objects.filter(email=email).filter(isactive=True)
        if queryset.exists():
            raise ValidationError('You are already subscribed!')
        else:
            serializer.save(isactive=True)


class NewsletterUnsubscription(views.APIView):
    def post(self, request):
        ip = get_client_ip(request)
        email = request.data.get('email', None)
        if email is None:
            response = {"error": "Invalid context!"}  # Correct dictionary key was not found
            raise ValidationError(response)
        else:
            existingSubscriber = NewsletterSubscriber.objects.filter(email=email)
            if existingSubscriber.exists():
                existingSubscriber = existingSubscriber.first()
                if existingSubscriber.isactive:
                    existingSubscriber.isactive = False
                    existingSubscriber.save()
                    response = {"success": f"Email unsubscribed!"}  # Successfully unsubscribed email
                else:
                    response = {"success": f"Email not subscribed!"}  # Email was already unsubscribed
            else:
                response = {"error": f"Invalid email!"}  # Email not found in the system
                raise ValidationError(response)
            return Response(response)
