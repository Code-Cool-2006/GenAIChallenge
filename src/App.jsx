import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ResumePage from "./pages/ResumePage";
import MockInterview from "./pages/MockInterview";
import CareerRoadmap from "./pages/CareerRoadmap";
import ChatBot from "./pages/ChatBot";
import JobMarketPage from "./pages/JobMarketPage";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import "./styles/main.css";
import LoginPage from "./pages/LoginPage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes with Navbar */}
          <Route
            path="/*"
            element={
              <div>
                <Navbar />
                <div
                  style={{
                    flex: "1 1 auto",
                    margin: "0 1rem 1rem 1rem",
                    padding: "0 1rem",
                    paddingTop: "var(--header-height, 72px)",
                  }}
                >
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/resume-builder" element={<ResumePage />} />
                    <Route path="/mock-interview" element={<MockInterview />} />
                    <Route path="/career-roadmap" element={<CareerRoadmap />} />
                    <Route path="/job-market" element={<JobMarketPage />} />
                    <Route
                      path="/resume-analyze"
                      element={<ResumeAnalyzer />}
                    />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/resume-builder" element={<ResumePage />} />
                    <Route path="/mock-interview" element={<MockInterview />} />
                    <Route path="/career-roadmap" element={<CareerRoadmap />} />
                    <Route path="/job-market" element={<JobMarketPage />} />
                    <Route
                      path="/resume-analyze"
                      element={<ResumeAnalyzer />}
                    />
                    <Route path="/chatbot" element={<ChatBot />} />
                  </Routes>
                </div>
                <Footer />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
