import React, { useRef, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Snackbar,
  Alert,
  TextField,
  Box,
} from "@mui/material";
import Webcam from "react-webcam";
import axios from "axios";

export default function FaceLogin({ setToken }) {
  const webcamRef = useRef(null);
  const [username, setUsername] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const handleLogin = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (!imageSrc) {
      return setSnackbar({
        open: true,
        type: "error",
        message: "Failed to capture image. Please check your camera.",
      });
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/verify_face/", {
        username,
        image: imageSrc,
      });

      if (res.data.verified && res.data.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        setSnackbar({
          open: true,
          type: "success",
          message: "✅ Face matched! Login successful.",
        });

        // Optional: redirect
        setTimeout(() => window.location.href = "/manage-face", 1500);
      } else {
        setSnackbar({
          open: true,
          type: "error",
          message: "❌ Face does not match.",
        });
      }
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        message: err.response?.data?.error || "An error occurred",
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Face Login
      </Typography>
      <Typography variant="body1" mb={2}>
        Enter your username and align your face in the webcam frame.
      </Typography>

      <TextField
        label="Username"
        fullWidth
        margin="normal"
        onChange={(e) => setUsername(e.target.value)}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 2,
          border: "2px solid #1976d2",
          borderRadius: 2,
          overflow: "hidden",
          width: 400,
          height: 300,
          mx: "auto",
        }}
      >
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          width={400}
          height={300}
          onUserMediaError={(err) =>
            console.error("Webcam access denied or unavailable:", err)
          }
          videoConstraints={{
            width: 400,
            height: 300,
            facingMode: "user",
          }}
        />
      </Box>

      <Box display="flex" justifyContent="center" mb={3}>
        <Button variant="contained" onClick={handleLogin}>
          Login with Face
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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
