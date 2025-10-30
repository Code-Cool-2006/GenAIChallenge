import React, { useState } from "react";
import { Spinner } from "react-bootstrap";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./CSS/home.css";

// --- Helper Components ---
// Loading animation
const LoadingSpinner = () => (
  <div
    className="d-flex justify-content-center align-items-center"
    style={{ height: "100%" }}
  >
    <Spinner
      animation="border"
      role="status"
      variant="primary"
      style={{ width: "3rem", height: "3rem" }}
    >
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

// Simple Markdown Renderer
const SimpleMarkdownRenderer = ({ text }) => {
  return (
    <div className="text-start text-secondary">
      {text.split("\n").map((line, index) => {
        if (line.startsWith("### ")) {
          return (
            <h5 key={index} className="fw-bold text-dark mt-3 mb-2">
              {line.substring(4)}
            </h5>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h4 key={index} className="fw-bold text-dark mt-3 mb-2">
              {line.substring(3)}
            </h4>
          );
        }
        if (line.startsWith("# ")) {
          return (
            <h3 key={index} className="fw-bold text-dark mt-3 mb-2">
              {line.substring(2)}
            </h3>
          );
        }
        if (line.match(/^\s*-\s/)) {
          return (
            <li key={index} className="ms-3">
              {line.replace(/^\s*-\s/, "")}
            </li>
          );
        }
        if (line.match(/^\s*\*\s/)) {
          return (
            <li key={index} className="ms-3">
              {line.replace(/^\s*\*\s/, "")}
            </li>
          );
        }
        if (line.trim() === "") {
          return <br key={index} />;
        }
        return <p key={index}>{line}</p>;
      })}
    </div>
  );
};

// --- Mock Data (For context) ---
const characterProfiles = {
  Explorer: { name: "The Explorer" },
  Captain: { name: "The Captain" },
  Connector: { name: "The Connector" },
  Challenger: { name: "The Challenger" },
  DeepDiver: { name: "The Deep Diver" },
};

// --- Resume Review Component ---
export default function ResumeReviewPage({ studentProfile }) {
  const [resumeText, setResumeText] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  // Initialize Gemini AI client
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

  const handleReviewRequest = async () => {
    if (!resumeText) {
      setError("Please paste your resume text into the box.");
      return;
    }
    setIsGenerating(true);
    setError("");
    setFeedback("");

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Request timed out")), 30000); // 30 second timeout
    });

    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: `You are an expert career coach and recruiter specializing in helping students from Tier 2/3 colleges land jobs at top companies.
Your feedback must be constructive, encouraging, and highly actionable.
Analyze the resume for ATS compatibility, impact metrics, action verbs, and clarity.
Provide feedback in simple markdown format.`,
      });

      const prompt = `Please review the following resume for a student from a ${
        studentProfile?.collegeTier || "Tier 2/3"
      } college.
Their self-identified character profile on CareerBridge is "${
        characterProfiles[studentProfile?.characterProfileKey]?.name ||
        "Not specified"
      }".
Their target skills are: ${
        studentProfile?.skills?.join(", ") || "Not specified"
      }.

Resume Text:
---
${resumeText}
---

Provide a review with the following structure:
### Overall Impression
(A brief, encouraging summary)

### ATS Compatibility Score: [Give a score out of 10]
(Briefly explain why, mentioning keywords and formatting)

### Actionable Feedback (Bulleted List)
- Point 1
- Point 2
- Point 3`;

      // Race between the API call and timeout
      const result = await Promise.race([
        model.generateContent(prompt),
        timeoutPromise,
      ]);

      const response = await result.response;
      const generatedText = response.text();

      if (generatedText && generatedText.trim()) {
        setFeedback(generatedText);
      } else {
        setError(
          "Could not get feedback. The model returned an empty response."
        );
      }
    } catch (err) {
      console.error("Gemini API error:", err);
      if (err.message === "Request timed out") {
        setError("Request timed out. Please try again with a shorter resume.");
      } else {
        setError(
          "An error occurred while generating feedback. Please check your internet connection and try again."
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="fw-bold mb-3">AI Resume Review</h1>
      <p className="text-muted mb-4">
        Paste your resume below and get instant, actionable feedback to improve
        it.
      </p>
      <div className="row g-4">
        {/* Resume Input Area */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <textarea
                className="form-control mb-3"
                rows="15"
                placeholder="Paste your full resume text here..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
              {error && <p className="text-danger small">{error}</p>}
              <button
                onClick={handleReviewRequest}
                disabled={isGenerating}
                className="btn btn-primary w-100 fw-bold"
              >
                {isGenerating ? "Analyzing..." : "✨ Get AI Feedback"}
              </button>
            </div>
          </div>
        </div>

        {/* AI Feedback Display Area */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="fw-bold mb-3">Feedback</h4>
              {isGenerating && <LoadingSpinner />}
              {feedback ? (
                <SimpleMarkdownRenderer text={feedback} />
              ) : (
                !isGenerating && (
                  <p className="text-muted">Your feedback will appear here.</p>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
