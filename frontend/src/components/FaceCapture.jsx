import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import axios from "axios";

export default function FaceCapture({ endpoint, token }) {
  const webcamRef = useRef(null);
  const [message, setMessage] = useState("");

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/${endpoint}/`,
        { image: imageSrc },
        {
          headers: token
            ? { Authorization: `Token ${token}` }
            : {},
        }
      );
      setMessage(JSON.stringify(response.data));
    } catch (err) {
      setMessage("Error: " + err.response?.data?.error || err.message);
    }
  };

  return (
    <div>
      <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" />
      <br />
      <button onClick={capture}>Submit Face</button>
      <p>{message}</p>
    </div>
  );
}