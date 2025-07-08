from rest_framework import serializers
from .models import FacialData

class FacialDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = FacialData
        fields = ['user', 'encoding', 'added_at']