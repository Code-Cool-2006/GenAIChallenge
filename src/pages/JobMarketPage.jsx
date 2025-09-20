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
import { FaSearch } from "react-icons/fa"; // install via: npm install react-icons

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
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 text-center flex items-center justify-center gap-2">
        📊 Job Market Insights
      </h1>
      <p className="text-gray-600 mt-2 text-center mb-8">
        Get real-time data on salary, demand, and top skills for any career.
      </p>

      {/* Input + Button */}
      <div className="flex gap-2 justify-center mb-6">
        <input
          type="text"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="Enter Job Title (e.g., UX Designer)"
          className="form-control w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleGetInsights}
          disabled={isLoading}
          className="btn btn-primary flex items-center gap-2"
        >
          <FaSearch />
          {isLoading ? "Analyzing..." : "Get Insights"}
        </button>
      </div>

      {/* Error */}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Insights */}
      {insights && (
        <div className="mt-10 space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
            <div className="bg-indigo-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">
                Average Salary
              </h3>
              <p className="text-2xl font-bold text-indigo-700 mt-2">
                {insights.averageSalary}
              </p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-600">
                Market Demand
              </h3>
              <p className="text-2xl font-bold text-green-700 mt-2">
                {insights.demand}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 text-center mb-4">
              Top Skills by Importance
            </h3>
            <div
              style={{
                width: "100%",
                height: insights.topSkills.length * 60, // dynamic height
              }}
            >
              <ResponsiveContainer>
                <BarChart
                  data={insights.topSkills}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  barCategoryGap={20}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={220}
                    tick={{ fontSize: 14, fill: "#374151" }}
                  />
                  <Tooltip cursor={{ fill: "rgba(238, 242, 255, 0.6)" }} />
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
  );
};

export default JobMarketPage;
