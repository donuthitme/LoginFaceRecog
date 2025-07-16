import numpy as np
import cv2
import base64
from deepface import DeepFace
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import FacialData
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework import status
from django.http import JsonResponse
from cryptography.fernet import Fernet
import os

# --- Encryption Setup ---
FERNET_KEY = os.environ.get("FERNET_KEY", Fernet.generate_key())
fernet = Fernet(FERNET_KEY)

# --- Helper Functions ---

def decode_image(base64_string):
    image_data = base64.b64decode(base64_string.split(',')[-1])
    nparr = np.frombuffer(image_data, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    return img

def encrypt_embedding(embedding):
    raw = np.asarray(embedding, dtype=np.float32).tobytes()
    return fernet.encrypt(raw)

def decrypt_embedding(encrypted_bytes):
    raw = fernet.decrypt(encrypted_bytes)
    return np.frombuffer(raw, dtype=np.float32)

def is_live_face(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    for (x, y, w, h) in faces:
        roi_gray = gray[y:y+h, x:x+w]
        eyes = eye_cascade.detectMultiScale(roi_gray)
        if len(eyes) >= 1:
            return True
    return False

# --- Face Upload ---

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_face(request):
    try:
        img = decode_image(request.data['image'])

        if not is_live_face(img):
            return Response({"error": "Liveness detection failed. Please blink or move slightly."}, status=403)

        embedding = DeepFace.represent(img_path=img, model_name='Facenet')[0]["embedding"]
        encrypted = encrypt_embedding(embedding)

        FacialData.objects.update_or_create(user=request.user, defaults={'encoding': encrypted})
        return Response({"status": "Face data uploaded successfully"})
    except Exception as e:
        return Response({"error": str(e)})

# --- Face Verification ---

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_face(request):
    try:
        img = decode_image(request.data['image'])

        if not is_live_face(img):
            return Response({"error": "Liveness detection failed"}, status=403)

        input_embedding = DeepFace.represent(img_path=img, model_name='Facenet')[0]["embedding"]
        input_encoding = np.asarray(input_embedding, dtype=np.float32)

        for face_data in FacialData.objects.select_related("user").all():
            try:
                saved_encoding = decrypt_embedding(face_data.encoding)
                distance = np.linalg.norm(saved_encoding - input_encoding)

                if distance < 10:  # Match threshold
                    token, _ = Token.objects.get_or_create(user=face_data.user)
                    return Response({
                        "verified": True,
                        "token": token.key,
                        "user_id": face_data.user.id
                    })
            except Exception:
                continue  # skip corrupt records silently

        return Response({ "verified": False })
    except Exception as e:
        return Response({ "error": str(e) })

# --- Face Data Deletion ---

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_face(request):
    try:
        FacialData.objects.get(user=request.user).delete()
        return Response({"status": "Face data deleted"})
    except:
        return Response({"status": "No face data to delete"})

# --- User Info for Display ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_info(request):
    return Response({
        "username": request.user.username,
        "user_id": request.user.id
    })

# --- Token-Based Auth ---

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists"}, status=400)

        user = User.objects.create_user(username=username, password=password)
        token = Token.objects.create(user=user)
        return Response({"token": token.key, "user_id": user.id})

class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user_id': user.id})