import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { FaSearch } from "react-icons/fa";
import "./CSS/home.css";

const JobMarketPage = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🎯 Add your Gemini API key here
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  const handleGetInsights = async () => {
    if (!jobTitle) {
      setError("Please enter a job title.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setInsights(null);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const systemPrompt = `
      You are a job market analyst. 
      Provide key insights for a specific job title.
      Respond ONLY with valid JSON in this format:
      {
        "averageSalary": "string (e.g. '$120,000 USD')",
        "demand": "string (e.g. 'High' or 'Growing by 15%')",
        "topSkills": [
          { "name": "string", "importance": number (1-100) }
        ]
      }
      Provide 5–10 top skills dynamically based on the role.
    `;
    const userQuery = `Provide job market insights for a "${jobTitle}".`;

    const payload = {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userQuery }] }],
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();

      if (!result.candidates || result.candidates.length === 0) {
        throw new Error("No valid response from Gemini. Try again.");
      }

      const rawText = result.candidates[0]?.content?.parts?.[0]?.text || "";
      const cleanedText = rawText.replace(/```json|```/g, "").trim();
      const parsedData = JSON.parse(cleanedText);

      // 🔽 Sort skills dynamically by importance
      parsedData.topSkills = parsedData.topSkills.sort(
        (a, b) => b.importance - a.importance
      );

      setInsights(parsedData);
    } catch (err) {
      console.error("API call failed:", err);
      setError(err.message || "Something went wrong while fetching insights.");
    } finally {
      setIsLoading(false);
    }
  };

  const barColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088fe",
    "#00c49f",
    "#ffbb28",
    "#d0ed57",
    "#a4de6c",
    "#f06292",
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero" style={{ paddingBottom: '2rem' }}>
        <div className="hero-content">
          <div className="hero-text" style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="hero-title">
              Job Market <span className="gradient-text">Insights</span>
            </h1>
            <p className="hero-subtitle">
              Get real-time data on salary trends, market demand, and top skills 
              for any career. Make informed decisions about your future.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="features" style={{ paddingTop: '2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem' }}>
          <div style={{
            background: 'var(--dark-card)',
            border: '1px solid var(--dark-border)',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '1rem', textAlign: 'center' }}>
              📊 Analyze Job Market Data
            </h2>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              Enter a job title to discover salary ranges, demand levels, and required skills
            </p>

            {/* Input + Button */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Enter Job Title (e.g., UX Designer)"
                style={{
                  flex: 1,
                  maxWidth: '500px',
                  padding: '0.875rem 1rem',
                  background: 'var(--dark-bg)',
                  border: '1px solid var(--dark-border)',
                  borderRadius: '8px',
                  color: 'var(--text-primary)',
                  fontSize: '1rem'
                }}
              />
              <button
                onClick={handleGetInsights}
                disabled={isLoading}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.875rem 1.5rem'
                }}
              >
                <FaSearch />
                {isLoading ? "Analyzing..." : "Get Insights"}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p style={{ color: '#ef4444', textAlign: 'center', marginBottom: '1rem' }}>
                {error}
              </p>
            )}

            {/* Insights */}
            {insights && (
              <div style={{ marginTop: '2rem', animation: 'fadeIn 0.6s ease' }}>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                  gap: '1.5rem', 
                  marginBottom: '2rem' 
                }}>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05))',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--primary)',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem'
                    }}>
                      Average Salary
                    </h3>
                    <p style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: '700',
                      background: 'var(--gradient)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}>
                      {insights.averageSalary}
                    </p>
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid #10b981',
                    textAlign: 'center'
                  }}>
                    <h3 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: 'var(--text-secondary)',
                      marginBottom: '0.5rem'
                    }}>
                      Market Demand
                    </h3>
                    <p style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: '700',
                      color: '#10b981'
                    }}>
                      {insights.demand}
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div style={{
                  background: 'var(--dark-bg)',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  border: '1px solid var(--dark-border)'
                }}>
                  <h3 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    textAlign: 'center', 
                    marginBottom: '1.5rem'
                  }}>
                    Top Skills by Importance
                  </h3>
                  <div style={{
                    width: '100%',
                    height: insights.topSkills.length * 60
                  }}>
                    <ResponsiveContainer>
                      <BarChart
                        data={insights.topSkills}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        barCategoryGap={20}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--dark-border)" />
                        <XAxis type="number" domain={[0, 100]} stroke="var(--text-secondary)" />
                        <YAxis
                          type="category"
                          dataKey="name"
                          width={220}
                          tick={{ fontSize: 14, fill: 'var(--text-primary)' }}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(99, 102, 241, 0.1)' }}
                          contentStyle={{
                            background: 'var(--dark-card)',
                            border: '1px solid var(--dark-border)',
                            borderRadius: '8px',
                            color: 'var(--text-primary)'
                          }}
                        />
                        <Bar dataKey="importance" barSize={22} radius={[5, 5, 5, 5]}>
                          {insights.topSkills.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={barColors[index % barColors.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="how-it-works">
        <div className="section-header">
          <h2>Why Job Market Insights Matter</h2>
          <p>Make data-driven career decisions</p>
        </div>

        <div className="steps-container">
          <div className="step">
            <div className="step-number">💰</div>
            <h3>Know Your Worth</h3>
            <p>
              Understand salary ranges and negotiate with confidence based on real market data.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">📈</div>
            <h3>Identify Trends</h3>
            <p>
              Spot growing industries and high-demand roles before the competition.
            </p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step">
            <div className="step-number">🎯</div>
            <h3>Focus Learning</h3>
            <p>
              Prioritize skills that matter most to employers in your target role.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default JobMarketPage;
