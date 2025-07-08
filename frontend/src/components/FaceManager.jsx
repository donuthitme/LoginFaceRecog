import React from "react";
import FaceCapture from "./FaceCapture";
import axios from "axios";

export default function FaceManager({ token }) {
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
    <div>
      <h3>Manage Face Data</h3>
      <FaceCapture endpoint="upload_face" token={token} />
      <button onClick={deleteFace}>Delete Face</button>
    </div>
  );
}