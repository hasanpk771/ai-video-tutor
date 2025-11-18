function smartTutorAI(text) {
  if (!text) return "I didn't hear you clearly. Please try again.";

  text = text.toLowerCase();

  // ----------------------------------------
  // 🚨 EMERGENCY / SELF-HARM DETECTION
  // ----------------------------------------
  const dangerWords = ["suicide", "kill myself", "self harm", "die", "end my life"];
  if (dangerWords.some(word => text.includes(word))) {
    return "I'm really sorry you're feeling this way. Please talk to someone you trust or contact your local helpline immediately. You’re not alone.";
  }

  // ----------------------------------------
  // 👋 GREETINGS
  // ----------------------------------------
  const greetingWords = ["hello", "hi", "hey", "tutor", "good morning", "good evening"];
  if (greetingWords.some(w => text.includes(w))) {
    return "Hello! I am your tutor. How can I guide you today?";
  }

  // ----------------------------------------
  // 💻 WEBSITE / WORDPRESS TOPICS
  // ----------------------------------------
  if (text.includes("wordpress") || text.includes("website") || text.includes("domain") || text.includes("hosting")) {
    return "You're asking about website/WordPress. Tell me exactly what you want to do — setup, theme, plugins, SEO, or error fixing?";
  }

  // ----------------------------------------
  // 🎧 WORK / JOB / GUIDE TOPICS
  // ----------------------------------------
  if (text.includes("work") || text.includes("job") || text.includes("guide") || text.includes("process")) {
    return "Sure! Tell me what type of work you want guidance about? Freelancing, coding, AI tools, WordPress, or something else?";
  }

  // ----------------------------------------
  // 📚 GENERAL QUESTIONS (fallback but smart)
  // ----------------------------------------
  if (text.length > 3) {
    return `You said: "${text}". Could you explain it a bit more so I can help properly?`;
  }

  // ----------------------------------------
  // DEFAULT
  // ----------------------------------------
  return "I didn’t understand that clearly. Could you say it again?";
}
