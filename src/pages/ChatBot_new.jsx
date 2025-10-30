import React, { useState, useRef, useEffect } from "react";
import "./CSS/home.css";

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "👋 Hi! I'm your Career & Job Market Assistant. Ask me anything about jobs, skills, or careers!",
      time: new Date().toLocaleTimeString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Client no longer calls Google directly; backend proxy handles API keys.

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // autosize textarea on input
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = Math.min(ta.scrollHeight, 240) + "px";
    }
  }, [input]);

  const addMessage = (role, text) => {
    setMessages((prev) => [
      ...prev,
      { role, text, time: new Date().toLocaleTimeString() },
    ]);
  };

  const sendMessage = async (evt) => {
    if (evt) evt.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    addMessage("user", trimmed);
    setInput("");
    setLoading(true);

    try {
      // POST to our server-side AI proxy to avoid exposing API keys in client
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `You are a career assistant. Only answer questions about careers, jobs, job market, and skills. If the question is outside this scope, politely decline. Question: ${trimmed}`,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Gemini API returned non-OK response:", res.status, text);
        addMessage("bot", `⚠️ Gemini API error (status ${res.status})`);
        setLoading(false);
        return;
      }

      const data = await res.json();

      // Try multiple possible response shapes (including our proxy reply)
      let botText = null;
      try {
        botText =
          data?.reply ||
          data?.candidates?.[0]?.content?.parts?.[0] ||
          data?.candidates?.[0]?.content?.[0]?.text ||
          data?.candidates?.[0]?.content?.[0] ||
          data?.output?.[0]?.content?.[0]?.text ||
          data?.output?.content?.[0]?.text ||
          null;
      } catch (e) {
        console.debug("Response parsing fallback failed:", e);
      }

      if (!botText) {
        console.warn("Unexpected AI response shape:", data);
        botText = "⚠️ Sorry, I couldn't get a response.";
      }

      addMessage("bot", botText);
    } catch (error) {
      console.error("Error with Gemini API:", error);
      addMessage("bot", "⚠️ Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "bot",
        text: "👋 Hi! I'm your Career & Job Market Assistant. Ask me anything about jobs, skills, or careers!",
        time: new Date().toLocaleTimeString(),
      },
    ]);
    setInput("");
  };

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ paddingBottom: "2rem" }}>
        <div className="hero-content">
          <div
            className="hero-text"
            style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}
          >
            <h1 className="hero-title">
              Career <span className="gradient-text">Chatbot</span>
            </h1>
            <p className="hero-subtitle">
              Get instant, AI-powered answers to all your career questions.
              Available 24/7 to guide you on your professional journey.
            </p>
          </div>
        </div>
      </section>

      {/* Chat Section */}
      <section className="features" style={{ paddingTop: "2rem" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "0 1rem" }}>
          <div
            style={{
              background: "var(--dark-card)",
              border: "1px solid var(--dark-border)",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Chat Header */}
            <div
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)",
                padding: "1rem 1.25rem",
                borderBottom: "1px solid var(--dark-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700 }}>
                💼 Career & Job Market ChatBot
              </h3>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button className="btn btn-ghost" onClick={clearChat}>
                  Clear
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div
              role="log"
              aria-live="polite"
              style={{
                height: "540px",
                overflowY: "auto",
                padding: "1rem",
                background: "var(--dark-bg)",
              }}
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    marginBottom: "1rem",
                    justifyContent:
                      msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  {msg.role === "bot" && (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: "var(--primary)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "0.75rem",
                        flexShrink: 0,
                      }}
                      aria-hidden
                    >
                      🤖
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: "78%",
                      padding: "0.85rem 1rem",
                      borderRadius: 12,
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg, #6366f1 0%, #ec4899 100%)"
                          : "var(--dark-card)",
                      border:
                        msg.role === "bot"
                          ? "1px solid var(--dark-border)"
                          : "none",
                      color: "var(--text-primary)",
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    <div style={{ fontSize: "0.95rem" }}>{msg.text}</div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        opacity: 0.6,
                        marginTop: 6,
                      }}
                    >
                      {msg.time}
                    </div>
                  </div>

                  {msg.role === "user" && (
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: "var(--dark-border)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: "0.75rem",
                        flexShrink: 0,
                      }}
                      aria-hidden
                    >
                      👤
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "0.95rem",
                    fontStyle: "italic",
                  }}
                >
                  Bot is typing...
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <form
              onSubmit={sendMessage}
              style={{
                padding: "1rem",
                borderTop: "1px solid var(--dark-border)",
                background: "var(--dark-card)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-end",
                }}
              >
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(e);
                    }
                  }}
                  placeholder="Ask about jobs, skills, or careers..."
                  rows={1}
                  aria-label="Chat message"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "var(--dark-bg)",
                    border: "1px solid var(--dark-border)",
                    borderRadius: "8px",
                    color: "var(--text-primary)",
                    fontSize: "1rem",
                    resize: "none",
                    fontFamily: "inherit",
                    minHeight: 38,
                    maxHeight: 240,
                  }}
                />

                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="btn btn-primary"
                  style={{ padding: "0.65rem 1rem", minWidth: 100 }}
                >
                  {loading ? "..." : "Send"}
                </button>
              </div>
            </form>
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
              Get personalized advice on career paths, skill development, and
              job opportunities.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">📊</div>
            <h3>Market Insights</h3>
            <p>
              Learn about industry trends, salary expectations, and in-demand
              skills.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">🎯</div>
            <h3>Job Search Tips</h3>
            <p>
              Receive expert tips on resumes, interviews, and landing your dream
              job.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChatBot;
