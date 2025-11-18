import React, { useState, useEffect, useRef } from "react";
import VideoTutor from "./VideoTutor";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

/**
 * Standalone Tutor App (no API).
 * - capture speech (react-speech-recognition)
 * - generate smart mock reply (keyword rules)
 * - use browser TTS (SpeechSynthesis) to speak reply
 * - play video (VideoTutor) and sync mouth via audio analyser
 */

function App() {
  const [messages, setMessages] = useState([]); // {sender: 'user'|'tutor', text}
  const [typing, setTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState(""); // if using pre-recorded audio, set path; else empty
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // simple keyword-based smarter replies
  const generateReply = (text) => {
    const lower = text.toLowerCase();

    const mappings = [
      { keys: ["gmail", "email", "login", "password"], reply:
        "Gmail fix: 1) 'Forgot password' use koren. 2) Recovery email/phone check koren. 3) 2-step verification disable koren jodi lock hoy." },
      { keys: ["math","solve","equation","calculate"], reply:
        "Math guide: Prothome question bujhun, tarpor variables identify korun, step-by-step solve korun. Bolun kon equation?" },
      { keys: ["react","component","jsx","hook","state"], reply:
        "React quick: Components UI blocks. Use useState for local state, useEffect for lifecycle. Need example?" },
      { keys: ["javascript","js","function","variable"], reply:
        "JavaScript tip: functions are reusable blocks. Use console.log for debugging. Need help on a specific snippet?" },
      { keys: ["hello","hi","assalam","hey"], reply:
        "Hello! I am your tutor. Ask any question about your project." },
      { keys: ["project","complete","finish","how to complete","deploy"], reply:
        "Project guide:\n1) Run frontend (npm start) and ensure UI working.\n2) Check voice permission.\n3) Test tutor voice and video.\n4) Record demo." },
      // add more topics as needed...
    ];

    for (let m of mappings) {
      if (m.keys.some(k => lower.includes(k))) return m.reply;
    }
    // fallback: ask for more details or offer help
    return "Bujhte parini — arektu details bolben? (e.g., 'my React state not updating')";
  };

  // play TTS and return the audio URL created (data URL) or null
  const speakAndGetAudio = (text) => {
    // Use SpeechSynthesisUtterance for live TTS (no audio file URL).
    // To enable VideoTutor mouth animation, we will generate an offline audio blob using WebSpeech API is not available.
    // Simpler approach: play utterance and separately use a dummy short silent audio for mouth anim OR use SpeechSynthesis only.
    // Here: we'll use SpeechSynthesis (no audioUrl) and also create a silent short audio fallback.
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) utter.voice = voices[voiceIndex % voices.length];
    utter.lang = "en-US";
    window.speechSynthesis.cancel(); // stop any ongoing
    window.speechSynthesis.speak(utter);
    // No audio URL returned; VideoTutor also accepts audio URL – if you want mouth sync,
    // you can supply a pre-recorded mp3 path for certain scripted replies.
    return null;
  };

  const askTutor = (text) => {
    if (!text || !text.trim()) return;
    // add user message
    setMessages(prev => [...prev, { sender: "user", text }]);

    setTyping(true);
    setTimeout(() => {
      const reply = generateReply(text);
      setTyping(false);
      setMessages(prev => [...prev, { sender: "tutor", text: reply }]);

      // speak
      const possibleAudioUrl = speakAndGetAudio(reply); // returns null in this approach
      setAudioUrl(possibleAudioUrl || ""); // if you have pre-recorded mp3s for selected replies, set path here
    }, 700); // small 'thinking' delay
  };

  // when transcript changes (speech captured), debounce and call askTutor
  useEffect(() => {
    if (transcript && transcript.trim() !== "") {
      const t = setTimeout(() => {
        askTutor(transcript);
        resetTranscript();
      }, 800); // 0.8s wait after last word
      return () => clearTimeout(t);
    }
  }, [transcript]);

  // UI handlers
  const startListening = () => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: "en-US" });
  };
  const stopListening = () => SpeechRecognition.stopListening();

  return (
    <div style={{
      padding: 20,
      fontFamily: "Arial, sans-serif",
      maxWidth: 900,
      margin: "0 auto",
      background: darkMode ? "#0f1720" : "#f6f8fa",
      color: darkMode ? "#e6eef6" : "#0b1220",
      minHeight: "100vh"
    }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>🎤 Mentor Tutor (Demo)</h1>
        <div>
          <button onClick={() => setDarkMode(d => !d)} style={{ marginRight: 8 }}>
            {darkMode ? "Light" : "Dark"}
          </button>
          <button onClick={() => setVoiceIndex(v => v + 1)}>Change Voice</button>
        </div>
      </header>

      <section style={{ display: "flex", gap: 20, marginTop: 16 }}>
        {/* Left: Video tutor */}
        <div style={{ flex: "0 0 380px" }}>
          <VideoTutor audioUrl={audioUrl} width={360} />
          <div style={{ marginTop: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={startListening}>Start Listening</button>
              <button onClick={stopListening}>Stop</button>
            </div>
            <p style={{ marginTop: 8 }}>Listening: {listening ? "Yes ✅" : "No ❌"}</p>
            <p><strong>Transcript:</strong> "{transcript}"</p>
          </div>
        </div>

        {/* Right: Chat area */}
        <div style={{ flex: 1 }}>
          <div style={{
            height: 520,
            overflowY: "auto",
            padding: 12,
            borderRadius: 8,
            background: darkMode ? "#071225" : "#fff",
            border: "1px solid #ddd"
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.sender === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div style={{
                  background: m.sender === "user" ? "#4caf50" : "#2196f3",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: 16,
                  maxWidth: "70%"
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {typing && <div style={{ fontStyle: "italic", marginBottom: 10 }}>Tutor is typing...</div>}
            <div ref={chatEndRef}></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
