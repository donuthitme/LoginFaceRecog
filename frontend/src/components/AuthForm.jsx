import React, { useState } from "react";
import axios from "axios";

export default function AuthForm({ setToken }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async (url) => {
    try {
      const res = await axios.post(`http://127.0.0.1:8000/api/${url}/`, {
        username,
        password,
      });
      setToken(res.data.token);
      alert(`Logged in as ${username}`);
    } catch (err) {
      alert(err.response?.data?.error || "Error logging in");
    }
  };

  return (
    <div>
      <h3>Login / Register</h3>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={() => handleAuth("login")}>Login</button>
      <button onClick={() => handleAuth("register")}>Register</button>
    </div>
  );
}