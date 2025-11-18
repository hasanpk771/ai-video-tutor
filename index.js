import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./components/Chatbot.css";



import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import gTTS from 'gtts';




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 🧠 Voice generation endpoint
app.post('/api/speak', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    const tts = new gTTS(text, 'en');
    const filePath = path.join(__dirname, 'tutor.mp3');

    tts.save(filePath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Speech generation failed' });
      }
      res.sendFile(filePath);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.listen(5000, () => console.log('🚀 Server running on http://localhost:5000'));
