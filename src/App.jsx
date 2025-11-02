import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ResumePage from "./pages/ResumePage";
import MockInterview from "./pages/MockInterview";
import CareerRoadmap from "./pages/CareerRoadmap";
import ChatBot from "./pages/ChatBot";
import JobMarketPage from "./pages/JobMarketPage";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import LoginPage from "./pages/LoginPage";

import "./styles/main.css";

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar always visible */}
        <Navbar />

        {/* Page Content */}
        <main
          style={{
            flex: "1 1 auto",
            margin: "0 1rem 1rem 1rem",
            padding: "0 1rem",
            paddingTop: "var(--header-height, 72px)",
          }}
        >
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/resume-builder" element={<ResumePage />} />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/career-roadmap" element={<CareerRoadmap />} />
            <Route path="/job-market" element={<JobMarketPage />} />
            <Route path="/resume-analyze" element={<ResumeAnalyzer />} />
            <Route path="/chatbot" element={<ChatBot />} />

            {/* Catch-all route for unknown paths */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        {/* Footer always visible */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
