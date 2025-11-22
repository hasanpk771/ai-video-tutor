// src/VideoTutor.js
import React, { useState, useEffect } from "react";
import smartTutorAI from "./smartTutorAI";

function VideoTutor() {
  const [text, setText] = useState("");
  const [reply, setReply] = useState("");
  const [listening, setListening] = useState(false);
  const tutorVideo = "/tutor.mp4";

  useEffect(() => {
    if (!text) return;

    const generatedReply = smartTutorAI(text);
    setReply(generatedReply);

    const utterance = new SpeechSynthesisUtterance(generatedReply);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, [text]);

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support voice input!");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => recognition.start(); // auto-restart
    recognition.onresult = (event) => {
      const spokenText = event.results[event.results.length - 1][0].transcript;
      setText(spokenText);
    };

    recognition.start();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>🎧 Professional Smart Voice Tutor</h2>

      <button onClick={startListening} style={{ padding: "10px", marginBottom: "10px" }}>
        {listening ? "🎤 Listening..." : "🎤 Speak"}
      </button>

      <div style={{ border: "1px solid #ddd", borderRadius: "10px", padding: "15px" }}>
        <p><strong>You said:</strong> {text}</p>
        <p><strong>Tutor:</strong> {reply}</p>

        <video
          src={tutorVideo}
          width="380"
          autoPlay
          loop
          style={{ borderRadius: "12px", marginTop: "10px" }}
        />
      </div>
    </div>
  );
}

export default VideoTutor;
