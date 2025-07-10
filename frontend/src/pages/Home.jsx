import React, { useEffect, useState } from "react";
import { Container, Typography } from "@mui/material";
import axios from "axios";

export default function Home() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get("http://127.0.0.1:8000/api/user-info/", {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setUsername(res.data.username);
      } catch (err) {
        console.error("Failed to fetch user info", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4">
        {username ? `Welcome back, ${username}!` : "Welcome to FaceAuth App!"}
      </Typography>
    </Container>
  );
}
