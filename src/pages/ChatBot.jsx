import React, { useState, useRef, useEffect } from "react";
import "./CSS/home.css";

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
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
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
    <>
      {/* Hero Section */}
      <section className="hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-content">
          <div className="hero-text" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="hero-title">
              Career <span className="gradient-text">Chatbot</span>
            </h1>
            <p className="hero-subtitle">
              Get instant, AI-powered answers to all your career questions. Available 24/7 to guide you on your professional journey.
            </p>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="features" style={{ paddingTop: '2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            background: 'var(--dark-card)',
            border: '1px solid var(--dark-border)',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Chat Header */}
            <div style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
              padding: '1.5rem',
              borderBottom: '1px solid var(--dark-border)'
            }}>
              <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>
                💼 Career & Job Market ChatBot
              </h3>
            </div>

            {/* Chat Body */}
            <div style={{
              height: '500px',
              overflowY: 'auto',
              padding: '1.5rem',
              background: 'var(--dark-bg)'
            }}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    marginBottom: '1.5rem',
                    justifyContent: msg.role === "user" ? 'flex-end' : 'flex-start'
                  }}
                >
                  {msg.role === "bot" && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--primary)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem',
                      flexShrink: 0
                    }}>
                      🤖
                    </div>
                  )}
                  <div style={{
                    maxWidth: '70%',
                    padding: '1rem 1.25rem',
                    borderRadius: '12px',
                    background: msg.role === "user" 
                      ? 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' 
                      : 'var(--dark-card)',
                    border: msg.role === "bot" ? '1px solid var(--dark-border)' : 'none',
                    color: 'var(--text-primary)',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}>
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--dark-border)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '0.75rem',
                      flexShrink: 0
                    }}>
                      👤
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={{ 
                  color: 'var(--text-secondary)', 
                  fontSize: '0.9rem',
                  fontStyle: 'italic',
                  marginLeft: '3rem'
                }}>
                  Bot is typing...
                </div>
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input Section */}
            <div style={{
              padding: '1.5rem',
              borderTop: '1px solid var(--dark-border)',
              background: 'var(--dark-card)'
            }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about jobs, skills, or careers..."
                  rows="1"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    background: 'var(--dark-bg)',
                    border: '1px solid var(--dark-border)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="btn btn-primary"
                  style={{
                    padding: '0.75rem 1.5rem',
                    minWidth: '100px'
                  }}
                >
                  {loading ? "..." : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>How It Helps</h2>
          <p>Your 24/7 career companion</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">💡</div>
            <h3>Career Guidance</h3>
            <p>
              Get personalized advice on career paths, skill development, and job opportunities.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">📊</div>
            <h3>Market Insights</h3>
            <p>
              Learn about industry trends, salary expectations, and in-demand skills.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">🎯</div>
            <h3>Job Search Tips</h3>
            <p>
              Receive expert tips on resumes, interviews, and landing your dream job.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatBot;
