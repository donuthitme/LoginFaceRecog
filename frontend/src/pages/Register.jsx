import { useState } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/register/", {
        username, password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/manage-face");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <Container>
      <Typography variant="h4" mt={3}>Register</Typography>
      <TextField label="Username" fullWidth margin="normal" onChange={e => setUsername(e.target.value)} />
      <TextField label="Password" fullWidth margin="normal" type="password" onChange={e => setPassword(e.target.value)} />
      <Button variant="contained" onClick={handleRegister}>Register</Button>
    </Container>
  );
}