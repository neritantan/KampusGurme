from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .models import DailyMenu
from .serializers import DailyMenuSerializer

###################################################

class TodayMenuView(APIView):
    def get(self, request):                     # GET
        today = timezone.now().date()
        try:
            menu = DailyMenu.objects.get(menu_date=today)# get today's menu
            serializer = DailyMenuSerializer(menu) # turn it to JSON
            return Response(serializer.data, status=status.HTTP_200_OK)
        except DailyMenu.DoesNotExist:
            return Response(
                {"error": "Bugün yemek çıkmadı aga, aç kaldık."},
                status=status.HTTP_404_NOT_FOUND
            )



