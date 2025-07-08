from django.contrib.auth.models import User
from django.db import models

class FacialData(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    encoding = models.BinaryField()
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.user.username