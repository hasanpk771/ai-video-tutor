// frontend/src/components/VoiceTutor.js
import React, { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import VideoTutor from "./VideoTutor";

const VoiceTutor = () => {
  const [response, setResponse] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState(""); // Video guide URL

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p>Browser voice recognition support করে না 😔</p>;
  }

  const handleSend = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: transcript }),
      });
      const data = await res.json();
      setResponse(data.reply || "No reply from tutor");
      setAudioUrl(data.audio || "");
      setVideoUrl(data.video || ""); // server থেকে video path পাওয়া যাবে
    } catch (err) {
      console.error("Error fetching tutor response:", err);
      setResponse("Server error, try again later.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>🎤 Voice Tutor</h2>
      <p>Listening: {listening ? "On" : "Off"}</p>
      <button onClick={SpeechRecognition.startListening}>🎙️ Start</button>
      <button onClick={SpeechRecognition.stopListening}>🛑 Stop</button>
      <button onClick={resetTranscript}>♻️ Reset</button>
      <button onClick={handleSend}>🚀 Send to Tutor</button>

      <div style={{ marginTop: "20px" }}>
        <p><strong>You said:</strong> {transcript}</p>
        <p><strong>Tutor says:</strong> {response}</p>

        {audioUrl && (
          <audio controls autoPlay src={audioUrl} style={{ marginTop: "10px" }}></audio>
        )}

        {/* Video guide */}
        {videoUrl && <VideoTutor video={videoUrl} />}
      </div>
    </div>
  );
};

export default VoiceTutor;
