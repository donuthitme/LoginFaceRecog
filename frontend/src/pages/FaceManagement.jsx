import { Container, Typography, Button } from "@mui/material";
import axios from "axios";
import FaceCapture from "../components/FaceCapture";

export default function FaceManagement({ token }) {
  const deleteFace = async () => {
    try {
      const res = await axios.delete("http://127.0.0.1:8000/api/delete_face/", {
        headers: { Authorization: `Token ${token}` },
      });
      alert(res.data.status);
    } catch (err) {
      alert("Error deleting face");
    }
  };

  return (
    <Container>
      <Typography variant="h4" mt={3}>Manage Face</Typography>
      <Typography variant="body1" mt={1}>Capture face below to upload or update:</Typography>
      <FaceCapture endpoint="upload_face" token={token} />
      <Button color="error" variant="outlined" onClick={deleteFace}>
        Delete Face
      </Button>
    </Container>
  );
}