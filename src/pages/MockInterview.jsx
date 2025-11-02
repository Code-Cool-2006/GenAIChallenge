import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

export default function MockInterview() {
  // --- STATE MANAGEMENT ---
  const [screen, setScreen] = useState("landing");
  const [selectedRole, setSelectedRole] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const messagesEndRef = useRef(null);
  const answerInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // --- DATA ---
  const roles = {
    hr: { label: "HR Manager", icon: "👥" },
    technical: { label: "Technical Lead", icon: "💻" },
    data: { label: "Data Analyst", icon: "📊" },
    developer: { label: "Software Developer", icon: "🚀" },
    marketing: { label: "Marketing Manager", icon: "📈" },
    sales: { label: "Sales Executive", icon: "💼" },
  };

  const questions = {
    hr: [
      "Tell me about yourself and what interests you about this role?",
      "What motivates you in your work?",
      "How do you handle workplace conflicts?",
      "Describe a challenging situation you've overcome.",
      "Where do you see yourself in 5 years?",
      "What are your salary expectations?",
      "Why are you leaving your current job?",
      "Do you have any questions for us?",
    ],
    technical: [
      "Tell me about yourself and your technical background.",
      "Explain the difference between SQL and NoSQL databases.",
      "How would you optimize a slow-running query?",
      "Describe your experience with cloud platforms.",
      "Walk me through your debugging process.",
      "How do you stay updated with technology trends?",
      "Describe a complex technical problem you solved.",
      "What questions do you have about our tech stack?",
    ],
    data: [
      "Tell me about yourself and your data analysis experience.",
      "How do you approach a new dataset?",
      "Explain the difference between correlation and causation.",
      "Describe your experience with data visualization tools.",
      "How do you handle missing or dirty data?",
      "What's your process for validating your analysis?",
      "Tell me about a time when your analysis changed business decisions.",
      "What questions do you have about our data infrastructure?",
    ],
    developer: [
      "Tell me about yourself and your development experience.",
      "What's your favorite programming language and why?",
      "How do you approach debugging a complex issue?",
      "Describe your experience with version control systems.",
      "How do you ensure code quality in your projects?",
      "Tell me about a challenging project you've worked on.",
      "How do you stay current with new technologies?",
      "What questions do you have about our development process?",
    ],
    marketing: [
      "Tell me about yourself and your marketing background.",
      "How do you measure the success of a marketing campaign?",
      "Describe your experience with digital marketing channels.",
      "How do you identify and target your ideal customer?",
      "Tell me about a successful campaign you've managed.",
      "How do you stay updated with marketing trends?",
      "Describe your approach to budget allocation.",
      "What questions do you have about our marketing strategy?",
    ],
    sales: [
      "Tell me about yourself and your sales experience.",
      "How do you handle rejection in sales?",
      "Describe your sales process from lead to close.",
      "How do you build rapport with potential clients?",
      "Tell me about your biggest sales win.",
      "How do you stay motivated during slow periods?",
      "Describe your approach to CRM management.",
      "What questions do you have about our sales targets?",
    ],
  };

  // New state for AI generated questions
  const [aiQuestions, setAiQuestions] = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);

  // Initialize Gemini AI client
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  // Function to generate AI questions based on selected role
  const generateAiQuestions = async (role) => {
    setIsLoadingQuestions(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const prompt = `Generate 8 interview questions for the role of ${role} in a professional and concise manner. Number them 1-8 and make each question on a new line.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = response.text();
      // Split questions by new lines and filter out empty lines
      const questionsArray = generatedText
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q.length > 0 && /^\d+\./.test(q)) // Filter lines that start with numbers
        .map((q) => q.replace(/^\d+\.\s*/, "")); // Remove numbering
      setAiQuestions(questionsArray);
    } catch (error) {
      console.error("Error generating AI questions:", error);
      setAiQuestions([]);
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  // Modify handleStartInterview to use AI questions if available
  const handleStartInterview = () => {
    if (!selectedRole) return;
    setScreen("interview");
    setCurrentQuestionIndex(0);
    setConfidenceScore(0);
    if (aiQuestions.length > 0) {
      setMessages([
        { text: aiQuestions[0], isAI: true, timestamp: new Date() },
      ]);
    } else {
      setMessages([
        { text: questions[selectedRole][0], isAI: true, timestamp: new Date() },
      ]);
    }
    setFeedback(null);
  };

  // Generate AI questions when selectedRole changes
  useEffect(() => {
    if (selectedRole) {
      generateAiQuestions(selectedRole);
    } else {
      setAiQuestions([]);
    }
  }, [selectedRole]);

  const totalQuestions = 8;

  // --- REACT HOOKS AND FUNCTIONS ---
  useEffect(() => {
    const ensureLink = (id, href, rel = "stylesheet") => {
      let el = document.getElementById(id);
      if (!el) {
        el = document.createElement("link");
        el.id = id;
        el.rel = rel;
        el.href = href;
        document.head.appendChild(el);
      }
      return el;
    };

    ensureLink(
      "google-font-inter",
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap"
    );

    // Add Font Awesome for icons
    ensureLink(
      "font-awesome",
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
    );

    const ensureScript = (id, src) => {
      return new Promise((resolve) => {
        const existing = document.getElementById(id);
        if (existing) {
          if (window.tsParticles) return resolve();
          existing.addEventListener("load", () => resolve());
          return;
        }
        const script = document.createElement("script");
        script.id = id;
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    ensureScript(
      "tsparticles-cdn",
      "https://cdn.jsdelivr.net/npm/tsparticles@2.12.0/tsparticles.bundle.min.js"
    ).then(() => {
      if (window.tsParticles) {
        window.tsParticles.load("particles-js", {
          particles: {
            number: { value: 150, density: { enable: true, value_area: 800 } },
            color: { value: ["#0ea5e9", "#64748b", "#ffffff"] },
            shape: { type: "circle" },
            opacity: { value: { min: 0.1, max: 0.5 }, random: true },
            size: { value: { min: 1, max: 3 }, random: true },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#2563eb",
              opacity: 0.2,
              width: 1,
            },
            move: {
              enable: true,
              speed: 1,
              direction: "none",
              random: true,
              straight: false,
              out_mode: "out",
              bounce: false,
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: { enable: true, mode: "grab" },
              onclick: { enable: true, mode: "push" },
              resize: true,
            },
            modes: {
              grab: { distance: 140, line_linked: { opacity: 0.5 } },
              push: { particles_nb: 4 },
            },
          },
          retina_detect: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    const answer = answerInputRef.current.value.trim();
    if (!answer || isRecording || isTyping) return;
    addMessage(answer, false);
    answerInputRef.current.value = "";
    generateFeedback(answer);
  };

  const addMessage = (text, isAI) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text, isAI, timestamp: new Date() },
    ]);
    if (!isAI) {
      handleNextQuestion();
    }
  };

  const handleNextQuestion = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const nextQuestion = currentQuestionIndex + 1;
      if (nextQuestion >= totalQuestions) {
        setScreen("summary");
      } else {
        const questionText =
          aiQuestions.length > nextQuestion
            ? aiQuestions[nextQuestion]
            : questions[selectedRole][nextQuestion];
        addMessage(questionText, true);
        setCurrentQuestionIndex(nextQuestion);
      }
    }, 2000);
  };

  const generateFeedback = (answer) => {
    const wordCount = answer.split(" ").length;
    const hasSpecificExamples =
      answer.toLowerCase().includes("example") ||
      answer.toLowerCase().includes("project") ||
      answer.toLowerCase().includes("experience");
    const clarity = Math.min(
      95,
      Math.max(20, wordCount * 2 + (hasSpecificExamples ? 20 : 0))
    );
    const confidenceEmojis = {
      low: "😟 unsure",
      neutral: "😐 average",
      good: "🙂 confident",
      high: "😎 strong",
    };
    let confidenceLevel = "neutral";
    if (clarity >= 80) confidenceLevel = "high";
    else if (clarity >= 60) confidenceLevel = "good";
    else if (clarity < 40) confidenceLevel = "low";
    const keywords = generateMissingKeywords(answer);
    const suggestion = generateSuggestion(clarity, hasSpecificExamples);
    const starExample = generateStarExample();
    setFeedback({
      clarity,
      confidence: confidenceEmojis[confidenceLevel],
      missingKeywords: keywords,
      suggestion,
      starExample,
    });
    const overallScore = Math.min(
      100,
      clarity + (hasSpecificExamples ? 10 : 0)
    );
    setConfidenceScore(overallScore);
  };

  const generateMissingKeywords = (answer) => {
    const commonKeywords = [
      "leadership",
      "teamwork",
      "problem-solving",
      "communication",
      "results",
      "metrics",
      "collaboration",
      "innovation",
      "efficiency",
    ];
    return commonKeywords
      .filter((keyword) => !answer.toLowerCase().includes(keyword))
      .slice(0, 3);
  };

  const generateSuggestion = (clarity, hasExamples) => {
    if (clarity < 40)
      return "Try to be more specific and provide concrete details about your experience.";
    if (!hasExamples)
      return "Consider adding a specific example to illustrate your point.";
    if (clarity < 70)
      return "Great start! You could strengthen this by quantifying your impact with numbers.";
    return "Excellent response! You've provided clear, specific examples with good detail.";
  };

  const generateStarExample = () => {
    return `**Situation**: At my previous company, our team was struggling with customer response times.
**Task**: I was asked to improve our support process and reduce response time by 50%.
**Action**: I implemented a new ticketing system and created response templates for common issues.
**Result**: We reduced average response time from 4 hours to 1.5 hours, improving customer satisfaction by 35%.`;
  };

  const getProgressClass = (score) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-destructive";
  };

  const getConfidenceClass = (confidence) => {
    if (typeof confidence === "number") {
      if (confidence >= 80) return "text-primary";
      if (confidence >= 60) return "text-success";
      if (confidence >= 40) return "text-warning";
      return "text-destructive";
    }
    if (confidence.includes("😟")) return "text-destructive";
    if (confidence.includes("😐")) return "text-warning";
    if (confidence.includes("🙂")) return "text-success";
    if (confidence.includes("😎")) return "text-primary";
    return "text-muted";
  };

  const getReadinessData = (score) => {
    if (score >= 71) {
      return {
        title: "Interview Ready! 🎉",
        strengths: [
          "Clear and confident communication",
          "Relevant examples and experiences",
          "Good understanding of role requirements",
        ],
        weaknesses: [
          "Consider practicing salary negotiation",
          "Prepare more technical depth questions",
        ],
        roadmap:
          "You're well-prepared! Focus on company research and prepare thoughtful questions for the interviewer.",
      };
    } else if (score >= 41) {
      return {
        title: "Getting There! 💪",
        strengths: [
          "Shows basic understanding of the role",
          "Demonstrates relevant experience",
          "Positive attitude and enthusiasm",
        ],
        weaknesses: [
          "Need more specific examples",
          "Improve storytelling structure (STAR method)",
          "Practice technical terminology",
        ],
        roadmap:
          "Practice more behavioral questions and develop concrete examples using the STAR method.",
      };
    } else {
      return {
        title: "Keep Practicing! 📚",
        strengths: [
          "Showing interest in the position",
          "Willing to learn and improve",
          "Good foundation to build upon",
        ],
        weaknesses: [
          "Need more preparation on role basics",
          "Develop clear examples from experience",
          "Work on confident delivery",
          "Research common interview questions",
        ],
        roadmap:
          "Focus on fundamental interview skills. Practice common questions and develop your personal story.",
      };
    }
  };

  const generatePracticeOptions = () => {
    return [
      {
        id: "leadership",
        title: "Leadership Round",
        icon: "👑",
        description: "Practice leadership and management scenarios",
      },
      {
        id: "technical",
        title: "Technical Deep-dive",
        icon: "⚡",
        description: "Advanced technical problem solving",
      },
      {
        id: "behavioral",
        title: "Behavioral Questions",
        icon: "🧠",
        description: "STAR method and soft skills",
      },
      {
        id: "case-study",
        title: "Case Study",
        icon: "📋",
        description: "Business problem analysis",
      },
    ];
  };

  const startPracticeSession = (type) => {
    setModalMessage(
      `Starting ${type} practice session... (This would start a new specialized interview)`
    );
    setIsModalOpen(true);
  };

  const restartInterview = () => {
    setScreen("landing");
    setSelectedRole("");
    setCurrentQuestionIndex(0);
    setConfidenceScore(0);
    setMessages([]);
    setFeedback(null);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        answerInputRef.current.value =
          "This is a simulated voice response. Voice recognition would be implemented here.";
        handleAnswerSubmit({ preventDefault: () => {} });
      }, 3000);
    }
  };

  const renderScreen = () => {
    if (screen === "landing") {
      return (
        <div className="mock-interview-page screen active bg-dark text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
          <div className="container text-center position-relative">
            <div
              id="particles-js"
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{ zIndex: 0 }}
            />
            <div className="position-relative" style={{ zIndex: 1 }}>
              <h1 className="display-4 fw-bold mb-4 text-primary">
                Mock Interview Simulator
              </h1>
              <p className="lead mb-5 text-secondary">
                Practice interviews. Get AI-backed feedback. Boost confidence.
              </p>

              <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-3 mb-5">
                <select
                  id="roleSelect"
                  className="form-select w-100 w-sm-auto"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">
                    Select the role you're interviewing for...
                  </option>
                  {Object.entries(roles).map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.icon} {value.label}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleStartInterview}
                  className="btn btn-primary d-flex align-items-center gap-2"
                  disabled={!selectedRole || isLoadingQuestions}
                >
                  {isLoadingQuestions ? (
                    <>
                      <div
                        className="spinner-border spinner-border-sm"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      <span>Generating Questions...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-play"></i>
                      <span>Start Interview</span>
                    </>
                  )}
                </button>
              </div>

              <div className="row row-cols-1 row-cols-md-3 g-4">
                <div className="col">
                  <div className="card bg-secondary bg-opacity-10 border-0 h-100 p-3">
                    <h4 className="card-title text-primary d-flex align-items-center gap-2">
                      <i className="fas fa-target"></i> Skills Mapping
                    </h4>
                    <p className="card-text text-muted">
                      Identify and visualize your current skills with AI-powered
                      assessment
                    </p>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-secondary bg-opacity-10 border-0 h-100 p-3">
                    <h4 className="card-title text-primary d-flex align-items-center gap-2">
                      <i className="fas fa-brain"></i> Real-Time Feedback
                    </h4>
                    <p className="card-text text-muted">
                      Get intelligent recommendations for skill development and
                      career growth
                    </p>
                  </div>
                </div>
                <div className="col">
                  <div className="card bg-secondary bg-opacity-10 border-0 h-100 p-3">
                    <h4 className="card-title text-primary d-flex align-items-center gap-2">
                      <i className="fas fa-sparkles"></i> AI Insights
                    </h4>
                    <p className="card-text text-muted">
                      Discover personalized career paths based on market trends
                      and your profile
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (screen === "interview") {
      return (
        <div
          id="interviewPage"
          className={`screen ${screen === "interview" ? "active" : ""}`}
        >
          <div className="d-flex flex-column vh-100">
            <div className="px-3 py-3 border-bottom border-secondary bg-dark">
              <div className="container d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                  <div className="badge bg-primary text-white px-3 py-2 rounded-pill">
                    <i className="me-2">{roles[selectedRole].icon}</i>
                    {roles[selectedRole].label}
                  </div>
                  <div className="text-muted small">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <div className="text-muted small fw-medium">
                    Confidence Score
                  </div>
                  <div
                    className={`fw-bold ${getConfidenceClass(confidenceScore)}`}
                  >
                    {Math.round(confidenceScore)}
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div
                  className="progress bg-secondary"
                  style={{ height: "8px" }}
                >
                  <div
                    className={`progress-bar ${getProgressClass(
                      confidenceScore
                    )}`}
                    style={{
                      width: `${
                        (currentQuestionIndex / totalQuestions) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex-grow-1 p-3 overflow-hidden">
              <div className="d-flex flex-column flex-lg-row h-100 gap-3">
                <div className="d-flex flex-column flex-grow-1 h-100">
                  <div className="card h-100 d-flex flex-column">
                    <div className="card-header d-flex justify-content-between align-items-center border-bottom border-secondary">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          <i className="fas fa-robot"></i>
                        </div>
                        <div>
                          <h5 className="mb-0">AI Interviewer</h5>
                          <small className="text-muted">
                            Ready to help you practice
                          </small>
                        </div>
                      </div>
                      {isTyping && (
                        <div className="d-flex align-items-center gap-2 text-muted small">
                          <div
                            className="bg-secondary rounded-circle"
                            style={{
                              width: "8px",
                              height: "8px",
                              animation: "pulse 1.5s infinite",
                            }}
                          ></div>
                          <div
                            className="bg-secondary rounded-circle"
                            style={{
                              width: "8px",
                              height: "8px",
                              animation: "pulse 1.5s infinite 0.2s",
                            }}
                          ></div>
                          <div
                            className="bg-secondary rounded-circle"
                            style={{
                              width: "8px",
                              height: "8px",
                              animation: "pulse 1.5s infinite 0.4s",
                            }}
                          ></div>
                          <span>Typing...</span>
                        </div>
                      )}
                    </div>
                    <div className="card-body flex-grow-1 overflow-auto">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`d-flex mb-3 ${
                            msg.isAI
                              ? "justify-content-start"
                              : "justify-content-end"
                          }`}
                        >
                          <div
                            className={`d-flex align-items-start ${
                              msg.isAI ? "" : "flex-row-reverse"
                            }`}
                            style={{ maxWidth: "80%" }}
                          >
                            <div
                              className={`flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle me-3 ${
                                msg.isAI
                                  ? "bg-primary text-white"
                                  : "bg-secondary text-dark"
                              }`}
                              style={{ width: "32px", height: "32px" }}
                            >
                              <i
                                className={`fas ${
                                  msg.isAI ? "fa-robot" : "fa-user"
                                }`}
                              ></i>
                            </div>
                            <div>
                              <div
                                className={`p-3 rounded ${
                                  msg.isAI
                                    ? "bg-light text-dark"
                                    : "bg-primary text-white"
                                }`}
                              >
                                {msg.text}
                              </div>
                              <div
                                className={`mt-1 small text-muted ${
                                  msg.isAI ? "text-start" : "text-end"
                                }`}
                              >
                                {formatTime(msg.timestamp)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="card-footer border-top border-secondary">
                      <form
                        onSubmit={handleAnswerSubmit}
                        className="position-relative"
                      >
                        <textarea
                          ref={answerInputRef}
                          className="form-control pe-5"
                          rows={1}
                          placeholder="Type your answer here... (Press Enter to send, Shift+Enter for new line)"
                          disabled={isRecording || isTyping}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAnswerSubmit(e);
                            }
                          }}
                        ></textarea>
                        {isVoiceMode && (
                          <button
                            type="button"
                            onClick={toggleRecording}
                            className={`btn btn-sm position-absolute top-50 end-0 translate-middle-y me-5 rounded-circle ${
                              isRecording ? "btn-danger" : "btn-outline-primary"
                            }`}
                            disabled={isTyping}
                          >
                            <i
                              className={`fas ${
                                isRecording
                                  ? "fa-microphone"
                                  : "fa-microphone-slash"
                              }`}
                            ></i>
                          </button>
                        )}
                        <button
                          type="submit"
                          className="btn btn-primary btn-sm position-absolute top-50 end-0 translate-middle-y rounded-circle"
                          disabled={isTyping || isRecording}
                        >
                          <i className="fas fa-paper-plane"></i>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col w-full h-full space-y-6 lg:w-1/3 feedback-section">
                  <div className="p-6 rounded-lg card">
                    <div className="flex items-center gap-2 mb-4 feedback-header">
                      <i className="fas fa-chart-line text-primary"></i>
                      <h3 className="text-xl font-bold">Real-Time Feedback</h3>
                    </div>
                    <div id="feedbackContent">
                      {!feedback ? (
                        <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-full min-h-[150px]">
                          <i className="mb-2 text-3xl fas fa-comment-dots"></i>
                          <p>Answer a question to see feedback</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg bg-card-background">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">
                                Clarity Check
                              </span>
                              <span className="text-sm font-bold text-muted-foreground">
                                {feedback.clarity}/100
                              </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-input">
                              <div
                                className={`h-full ${getProgressClass(
                                  feedback.clarity
                                )}`}
                                style={{ width: `${feedback.clarity}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-card-background">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold">
                                Confidence Gauge
                              </span>
                              <span
                                className={`text-sm font-bold ${getConfidenceClass(
                                  feedback.confidence
                                )}`}
                              >
                                {feedback.confidence}
                              </span>
                            </div>
                          </div>

                          {feedback.missingKeywords.length > 0 && (
                            <div className="p-4 rounded-lg bg-card-background">
                              <div className="flex items-center gap-2 mb-2">
                                <i className="fas fa-exclamation-triangle text-warning"></i>
                                <span className="font-semibold">
                                  Missing Keywords
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-2 keywords-list">
                                {feedback.missingKeywords.map(
                                  (keyword, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-xs font-medium rounded-full bg-input text-muted-foreground"
                                    >
                                      {keyword}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                          <div className="p-4 rounded-lg bg-card-background">
                            <div className="flex items-center gap-2 mb-2">
                              <i className="fas fa-lightbulb text-accent"></i>
                              <span className="font-semibold">
                                Upgrade Suggestion
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {feedback.suggestion}
                            </p>
                          </div>

                          <div className="p-4 rounded-lg bg-card-background">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <i className="fas fa-star text-primary"></i>
                                <span className="font-semibold">
                                  STAR Answer Example
                                </span>
                              </div>
                            </div>
                            <pre className="p-2 text-xs rounded-md bg-input text-foreground overflow-x-auto whitespace-pre-wrap">
                              {feedback.starExample}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-6 rounded-lg card">
                    <h4 className="mb-2 text-lg font-bold">
                      <i className="mr-2 fas fa-lightbulb text-accent"></i>
                      Interview Tips
                    </h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Use the STAR method for behavioral questions</li>
                      <li>
                        • Include specific numbers and metrics when possible
                      </li>
                      <li>
                        • Practice active listening and ask follow-up questions
                      </li>
                      <li>
                        • Show enthusiasm and genuine interest in the role
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (screen === "summary") {
      const readinessData = getReadinessData(confidenceScore);
      const scoreGradientClass =
        confidenceScore >= 71
          ? "text-primary"
          : confidenceScore >= 41
          ? "text-warning"
          : "text-destructive";
      return (
        <div
          id="summaryPage"
          className={`screen ${screen === "summary" ? "active" : ""}`}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center min-h-screen">
            <div className="w-full max-w-6xl summary-container">
              <div className="mb-8 summary-header">
                <span className="inline-flex items-center gap-1 text-sm font-medium badge">
                  <i className="fas fa-sparkles text-purple-400"></i>
                  Interview Complete
                </span>
                <h1 className="mt-4 text-5xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
                  {readinessData.title}
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                  {roles[selectedRole].icon} {roles[selectedRole].label}{" "}
                  Interview Summary
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-6 rounded-lg md:col-span-1 lg:col-span-2 card">
                  <div className="flex items-center justify-center w-24 h-24 mx-auto mb-4 rounded-full bg-primary/20">
                    <span
                      className={`text-5xl font-extrabold ${scoreGradientClass}`}
                    >
                      {Math.round(confidenceScore)}
                    </span>
                  </div>
                  <div className="mb-4 text-lg font-bold text-center">
                    Final Confidence Score
                  </div>
                  <div className="h-3 overflow-hidden rounded-full progress-bar bg-input">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getProgressClass(
                        confidenceScore
                      )}`}
                      style={{ width: `${confidenceScore}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs font-medium text-muted-foreground flex justify-between">
                    <span>Needs Practice</span>
                    <span>Getting There</span>
                    <span>Interview Ready</span>
                  </div>
                </div>

                <div className="p-6 rounded-lg md:col-span-1 card">
                  <h3 className="mb-4 text-xl font-bold">Readiness Summary</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="flex items-center gap-2 text-success">
                        <i className="fas fa-check-circle"></i>
                        Strengths
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {readinessData.strengths.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-warning">
                        <i className="fas fa-exclamation-triangle"></i>
                        Areas for Improvement
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                        {readinessData.weaknesses.map((w, i) => (
                          <li key={i}>{w}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-primary">
                        <i className="fas fa-target"></i>
                        Next Steps
                      </h4>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {readinessData.roadmap}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-lg md:col-span-2 card">
                  <h3 className="mb-4 text-xl font-bold">What\'s Next?</h3>
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <button
                      onClick={restartInterview}
                      className="w-full py-3 font-semibold text-center transition-transform duration-200 rounded-lg btn-primary hover:scale-105"
                    >
                      <i className="mr-2 fas fa-redo"></i>
                      Try Another Interview
                    </button>
                    <button className="w-full py-3 font-semibold text-center transition-transform duration-200 rounded-lg btn-outline hover:scale-105">
                      <i className="mr-2 fas fa-download"></i>
                      Export PDF
                    </button>
                    <button className="w-full py-3 font-semibold text-center transition-transform duration-200 rounded-lg btn-outline hover:scale-105">
                      <i className="mr-2 fas fa-share"></i>
                      Share Results
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-lg md:col-span-2 card">
                  <h3 className="flex items-center gap-2 mb-4 text-xl font-bold">
                    <i className="fas fa-chart-line text-primary"></i>
                    Recommended Practice Sessions
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 practice-grid">
                    {generatePracticeOptions().map((option) => (
                      <div
                        key={option.id}
                        onClick={() => startPracticeSession(option.title)}
                        className="p-4 rounded-lg cursor-pointer practice-option bg-card-background hover:bg-card-foreground transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4 practice-option-content">
                          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 text-xl rounded-full bg-input">
                            {option.icon}
                          </div>
                          <div className="practice-option-details">
                            <h4 className="font-semibold">{option.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {option.description}
                            </p>
                            <span className="inline-flex items-center gap-1 mt-1 text-sm text-primary">
                              Start Practice
                              <i className="fas fa-arrow-right"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return renderScreen();
}
