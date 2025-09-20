// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I’m your Career & Job Market Assistant. Ask me anything about jobs, skills, or careers!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" +
          GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are a career assistant. Only answer questions about careers, jobs, job market, and skills. 
If the question is outside this scope, politely decline. Question: ${input}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const botText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ Sorry, I couldn’t get a response.";

      setMessages((prev) => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      console.error("Error with Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "⚠️ Server error. Try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: "750px" }}>
      <div className="card shadow-lg border-0 rounded-4">
        {/* Gradient Header */}
        <div
          className="card-header text-white rounded-top-4"
          style={{
            background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
          }}
        >
          <h5 className="mb-0 fw-bold">💼 Career & Job Market ChatBot</h5>
        </div>

        {/* Chat Body */}
        <div
          className="card-body bg-light"
          style={{ height: "550px", overflowY: "auto", padding: "1rem" }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`d-flex mb-3 ${
                msg.role === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              {msg.role === "bot" && (
                <div className="me-2">
                  <span
                    className="avatar bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    🤖
                  </span>
                </div>
              )}
              <div
                className={`p-3 rounded-4 shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-white"
                    : "bg-white border"
                }`}
                style={{ maxWidth: "70%", lineHeight: "1.4" }}
              >
                {msg.text}
              </div>
              {msg.role === "user" && (
                <div className="ms-2">
                  <span
                    className="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    👤
                  </span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="text-muted small fst-italic">Bot is typing...</div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Section */}
        <div className="card-footer bg-white border-0 rounded-bottom-4">
          <div className="input-group">
            <textarea
              className="form-control rounded-start-4"
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask about jobs, skills, or careers..."
              style={{ resize: "none" }}
            />
            <button
              className="btn btn-success rounded-end-4 px-4"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
