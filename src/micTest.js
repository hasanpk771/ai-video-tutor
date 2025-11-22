navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log("🎤 Microphone access OK"))
  .catch(err => console.error("❌ Mic error:", err));

