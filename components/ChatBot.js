import React, { useState, useEffect, useRef } from "react";
import { requestGuide } from "../api.js";
import "./chatbot.css";

export default function ChatBot() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [guideText, setGuideText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("SpeechRecognition not supported");
      return;
    }
    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);

    recog.onresult = async (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      // send to backend
      try {
        const data = await requestGuide(text);
        setGuideText(data.text);
        setVideoUrl(`http://localhost:5000${data.videoUrl}`); // full URL
      } catch (err) {
        console.error("Guide request failed:", err);
        setGuideText("Failed to get guide: " + (err.message || ""));
      }
    };

    recog.onerror = (e) => {
      console.error("Recognition error", e);
      setListening(false);
    };

    recognitionRef.current = recog;
    return () => {
      try { recog.stop(); } catch(_) {}
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert("Browser does not support Speech Recognition.");
      return;
    }
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Start listening error:", err);
    }
  };

  return (
    <div className="chatbot-container">
      <h2>AI Tutor 🎤 Voice → Video Guide</h2>
      <div>
        <button onClick={startListening} disabled={listening}>
          {listening ? "Listening..." : "🎤 Speak to Tutor"}
        </button>
      </div>

      <div className="status">
        <strong>You:</strong> {transcript}
      </div>

      <div className="status">
        <strong>Tutor text:</strong>
        <div style={{ whiteSpace: "pre-wrap" }}>{guideText}</div>
      </div>

      {videoUrl && (
        <div className="video-area">
          <h3>Video Guide</h3>
          <video src={videoUrl} controls autoPlay style={{ width: "80%", maxWidth: 900 }} />
        </div>
      )}
    </div>
  );
}
