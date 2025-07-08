import { Container, Typography } from "@mui/material";

export default function Home() {
  return (
    <Container>
      <Typography variant="h4" mt={3}>Welcome to Face Recognition Auth App</Typography>
      <Typography mt={2}>
        Use the navigation bar to register, login, and manage your face data.
      </Typography>
    </Container>
  );
}