import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FaceManagement from "./pages/FaceManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import FaceLogin from "./pages/FaceLogin";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  return (
    <>
      <Navbar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        <Route path="/face-login" element={<FaceLogin setToken={setToken} />} />
        <Route
          path="/manage-face"
          element={
            <ProtectedRoute token={token}>
              <FaceManagement token={token} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;