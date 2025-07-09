import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Typography,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import Webcam from "react-webcam";
import axios from "axios";

export default function FaceLogin({ setToken }) {
  const webcamRef = useRef(null);
  const [snackbar, setSnackbar] = useState({ open: false, type: "success", message: "" });
  const [loading, setLoading] = useState(false);

  // Auto-capture every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleAutoCapture();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAutoCapture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc || loading) return;

    setLoading(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/verify_face/", {
        image: imageSrc,
      });

      if (res.data.verified && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setSnackbar({
          open: true,
          type: "success",
          message: "✅ Face matched! Logging in...",
        });
        setTimeout(() => (window.location.href = "/manage-face"), 1500);
      } else {
        setSnackbar({
          open: true,
          type: "error",
          message: "❌ No matching face found.",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        message: err.response?.data?.error || "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Face Login
      </Typography>
      <Typography mb={2}>Align your face in the circle below</Typography>

      <Box
        sx={{
          position: "relative",
          width: 400,
          height: 300,
          mx: "auto",
          mb: 2,
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
          videoConstraints={{
            width: 400,
            height: 300,
            facingMode: "user",
          }}
          style={{ borderRadius: 12 }}
        />
        {/* Circle Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            border: "4px solid #1976d2",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />
      </Box>

      {loading && <CircularProgress />}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.type}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}