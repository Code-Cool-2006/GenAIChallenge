import React, { useEffect, useMemo, useRef, useState } from "react";

export default function CareerRoadmap() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [htmlOutput, setHtmlOutput] = useState("");
  const resultsRef = useRef(null);

  // Inject Tailwind CDN (if app doesn't have Tailwind configured) and Google Font
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

    if (!document.getElementById("tailwind-cdn")) {
      const tw = document.createElement("script");
      tw.id = "tailwind-cdn";
      tw.src = "https://cdn.tailwindcss.com";
      document.head.appendChild(tw);
    }
  }, []);

  // Load tsParticles bundle via CDN
  useEffect(() => {
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

  const formatResponse = useMemo(() => {
    return function formatResponse(text) {
      const lines = (text || "").split("\n");
      let htmlParts = [];
      let inList = false;

      const closeListIfOpen = () => {
        if (inList) {
          htmlParts.push("</ul>");
          inList = false;
        }
      };

      const applyInline = (s) => {
        s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
        s = s.replace(/\*(.*?)\*/g, "<em>$1</em>");
        return s;
      };

      for (const rawLine of lines) {
        const line = rawLine.trimEnd();
        if (/^#{1,6}\s+/.test(line)) {
          closeListIfOpen();
          const t = line.replace(/^#{1,6}\s+/, "");
          htmlParts.push(
            `<h3 class="text-xl font-bold text-sky-400 mb-2 mt-4">${applyInline(
              t
            )}</h3>`
          );
          continue;
        }
        const listMatch = line.match(/^[-*]\s+(.*)$/);
        if (listMatch) {
          if (!inList) {
            inList = true;
            htmlParts.push('<ul class="list-disc pl-6">');
          }
          htmlParts.push(
            `<li class="mb-1 ml-4">${applyInline(listMatch[1])}</li>`
          );
          continue;
        }
        if (line.trim() === "") {
          closeListIfOpen();
          htmlParts.push("<br>");
          continue;
        }
        closeListIfOpen();
        htmlParts.push(`<p class="mb-2">${applyInline(line)}</p>`);
      }

      closeListIfOpen();
      return htmlParts.join("");
    };
  }, []);

  async function callGeminiApi(
    userQuery,
    systemPrompt,
    retries = 3,
    delay = 1000
  ) {
    if (!apiKey) throw new Error("Missing Gemini API key");
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`API responded with status: ${response.status}`);
        }
        const result = await response.json();
        const candidate = result.candidates && result.candidates[0];
        if (
          candidate &&
          candidate.content &&
          candidate.content.parts &&
          candidate.content.parts[0] &&
          candidate.content.parts[0].text
        ) {
          return candidate.content.parts[0].text;
        }
        throw new Error("Invalid response structure from API.");
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((res) => setTimeout(res, delay * Math.pow(2, i)));
      }
    }
  }

  const onClickPathfinder = async () => {
    const value = jobTitle.trim();
    const resultsEl = resultsRef.current;
    if (!value) {
      setHtmlOutput(
        '<p class="text-amber-400">Please enter a job title to begin your journey.</p>'
      );
      if (resultsEl) {
        resultsEl.style.maxHeight = "1000px";
      }
      return;
    }

    setLoading(true);
    setHtmlOutput("");
    if (resultsEl) {
      resultsEl.style.maxHeight = "1000px";
      resultsEl.style.overflow = "hidden";
    }

    const systemPrompt = `You are a helpful and encouraging career advisor. Your goal is to provide clear, structured, and motivating career guidance based on a user's entered job title. Format your response using markdown with clear headings.`;
    const userQuery = `Provide a career path analysis for the job title: "${value}". Include these three sections:\n1.  *🚀 A Potential Career Path:* Start with the entry role and list 3-5 potential advancement steps.\n2.  *🔧 Key Skills to Master:* List 5-7 crucial technical and soft skills for success in this field.\n3.  *🤔 Sample Interview Questions:* Provide 3 insightful interview questions for this role, one behavioral, one technical, and one situational.`;

    try {
      const generatedText = await callGeminiApi(userQuery, systemPrompt);
      const formattedHtml = formatResponse(generatedText);
      setHtmlOutput(formattedHtml);
      if (resultsEl) {
        resultsEl.style.maxHeight = "none";
        resultsEl.style.overflow = "visible";
        resultsEl.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Gemini API Error:", error);
      setHtmlOutput(
        '<p class="text-red-400">Sorry, there was an issue connecting to the Career Pathfinder AI. Please try again later.</p>'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="bg-slate-900 text-white min-h-screen"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div
        id="particles-js"
        style={{
          position: "fixed",
          width: "100%",
          height: "calc(100% - 72px)",
          top: "72px",
          left: 0,
          zIndex: 0,
          backgroundColor: "#020617",
        }}
      />

      <div
        className="content-container p-4"
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: "4rem",
        }}
      >
        <div className="text-center max-w-3xl mx-auto w-full">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-4 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
              Every Career is a Story Waiting to Unfold
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Your journey is unique. It's time for the next chapter. Use our
            AI-powered Pathfinder to discover where your story can lead.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="relative w-full">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                type="text"
                placeholder="Enter a job title, e.g., 'Data Scientist'"
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all duration-300"
              />
            </div>
            <button
              onClick={onClickPathfinder}
              className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2"
            >
              ✨ Career Pathfinder
            </button>
          </div>
        </div>

        <div
          ref={resultsRef}
          className="mt-10 max-w-3xl w-full bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-6"
          style={{
            transition: "all 0.5s ease-in-out",
            maxHeight: 0,
            overflow: "hidden",
          }}
        >
          <div
            className={`${
              loading ? "flex" : "hidden"
            } justify-center items-center py-8`}
          >
            <div
              className="loader"
              style={{
                border: "4px solid #f3f3f3",
                borderTop: "4px solid #3498db",
                borderRadius: "50%",
                width: 40,
                height: 40,
                animation: "spin 2s linear infinite",
              }}
            />
            <p className="ml-4 text-slate-300">
              Gemini is charting the course...
            </p>
          </div>
          <div
            className="prose prose-invert max-w-none text-slate-200"
            dangerouslySetInnerHTML={{ __html: htmlOutput }}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
