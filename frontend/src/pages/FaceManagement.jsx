import { useRef, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Webcam from "react-webcam";
import axios from "axios";

export default function FaceManagement({ token }) {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    type: "success",
    message: "",
  });

  const captureAndUpload = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc || loading) return;

    setLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/upload_face/",
        { image: imageSrc },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setSnackbar({
        open: true,
        type: "success",
        message: res.data.status || "Face uploaded successfully",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        message: err.response?.data?.error || "Failed to upload face",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFace = async () => {
    try {
      const res = await axios.delete("http://127.0.0.1:8000/api/delete_face/", {
        headers: { Authorization: `Token ${token}` },
      });
      setSnackbar({
        open: true,
        type: "success",
        message: res.data.status || "Face data deleted",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        type: "error",
        message: "Error deleting face",
      });
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Manage Face
      </Typography>
      <Typography mb={2}>
        Align your face clearly and click the button below to upload/update
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: 400,
          height: 300,
          mx: "auto",
          mb: 2,
          borderRadius: 2,
          overflow: "hidden",
          border: "2px solid #1976d2",
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
        />
      </Box>

      <Box display="flex" justifyContent="center" gap={2} mb={2}>
        <Button
          variant="contained"
          onClick={captureAndUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload / Update Face"}
        </Button>
        <Button color="error" variant="outlined" onClick={deleteFace}>
          Delete Face
        </Button>
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
