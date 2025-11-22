export const requestTutor = async (text) => {
  const res = await fetch("http://localhost:5000/api/tutor", {  // backend URL ঠিক আছে কিনা চেক করো
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) throw new Error("Failed to contact tutor");

  const data = await res.json();

  // backend থেকে audio/video path যদি relative আসে তাহলে full URL বানানো
  return {
    reply: data.reply,
    audio: data.audio ? `http://localhost:5000${data.audio}` : "",
    video: data.video ? `http://localhost:5000${data.video}` : "",
  };
};
