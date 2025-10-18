import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

// --- GoogleAuth Component (Placeholder) ---
const GoogleAuth = ({ setMessage }) => {
  const handleGoogleLogin = () => {
    setMessage("ℹ Google login is a placeholder feature for demonstration.");
  };

  return (
    <button className="google-button" onClick={handleGoogleLogin}>
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google icon"
        className="google-icon"
      />
      Sign in with Google
    </button>
  );
};

// --- Main LoginPage Component ---
const LoginPage = () => {
  const navigate = useNavigate(); // Get the navigate function

  const API_BASE_URL = "http://localhost:8001";

  // --- State Management ---
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("free");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [careerTip, setCareerTip] = useState(
    "Your journey to a new career starts here. Login or create an account to continue."
  );
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [roleDescription, setRoleDescription] = useState("");

  // --- Helper Functions ---

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setMessage("");
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("free");
    setRoleDescription("");
  };

  const callGeminiProxy = async (prompt) => {
    // --- MOCK IMPLEMENTATION ---
    console.log(`Simulating Gemini call with prompt: "${prompt}"`);
    return new Promise(resolve => {
        setTimeout(() => {
          if (prompt.includes('career tip')) {
              resolve("Continuously learn and adapt; the tech landscape is always evolving.");
          } else if (prompt.includes("'free' account")) {
              resolve("The Free account offers essential access to browse opportunities and build your professional profile at no cost.");
          } else if (prompt.includes("'pro' account")) {
              resolve("Upgrade to a Pro account to unlock advanced analytics, direct messaging to recruiters, and premium placement in searches.");
          } else {
              resolve("This is a simulated response from the AI assistant.");
          }
        }, 1000);
    });
  };

  const generateCareerTip = async () => {
    setIsTipLoading(true);
    setCareerTip("Generating a new tip...");
    try {
      const prompt = "Give a single, concise, and inspiring career tip for a tech professional. Do not use quotes or markdown.";
      const text = await callGeminiProxy(prompt);
      setCareerTip(text || "Failed to load tip. Please try again.");
    } catch (err) {
      console.error("Gemini proxy fetch error:", err);
      setCareerTip("An error occurred while fetching a tip. Please try again.");
    } finally {
      setIsTipLoading(false);
    }
  };

  const getRoleDescription = async (selectedRole) => {
    if (!selectedRole) return;
    setRoleDescription(`Fetching description for ${selectedRole} role...`);
    try {
      const prompt = `Provide a concise, single-paragraph description for a '${selectedRole}' account on a career and professional development platform. Highlight the key benefits.`;
      const text = await callGeminiProxy(prompt);
      setRoleDescription(text || "Failed to load description. Please try again.");
    } catch (err) {
      console.error("Gemini proxy fetch error:", err);
      setRoleDescription("Failed to get description. Please try again.");
    }
  };

  // --- Event Handlers ---

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          password: password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Registration successful! Please proceed to login.");
        setIsRegister(false);
        setEmail("");
        setPassword("");
        setFullName("");
      } else {
        setMessage(`❌ ${data.detail || "Registration failed"}`);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("❌ An error occurred during registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`http://localhost:8001/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("✅ Login successful! Redirecting...");
        setTimeout(() => {
          navigate('/home');
        }, 1500);
      } else {
        setMessage(`❌ ${data.detail || "Login failed"}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("❌ An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    getRoleDescription(selectedRole);
  };

  const handleForgotPassword = (e) => {
      e.preventDefault();
      setMessage("ℹ The 'Forgot Password' feature is not yet implemented.");
  }

  // --- Render Method ---
  return (
    <>
      <style>{`
        /* --- CSS Variables and Body --- */
        :root {
          --primary-color: #6366f1;
          --primary-hover: #4f46e5;
          --text-primary: #1f2937;
          --text-secondary: #6b7280;
          --background-light: #f9fafb;
          --border-color: #d1d5db;
          --success-bg: #dcfce7;
          --success-text: #166534;
          --error-bg: #fee2e2;
          --error-text: #991b1b;
          --info-bg: #e0f2fe;
          --info-text: #075985;
          --white: #ffffff;
          --box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
          --font-family: 'Inter', sans-serif;
        }

        body {
          font-family: var(--font-family);
          background-color: var(--background-light);
          margin: 0;
          color: var(--text-primary);
        }

        /* --- Main Layout --- */
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        .login-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          max-width: 64rem;
          background-color: var(--white);
          border-radius: 1rem;
          box-shadow: var(--box-shadow);
          overflow: hidden;
        }

        /* --- Left Decorative Panel --- */
        .login-left {
          background-color: var(--primary-color);
          color: var(--white);
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .left-panel-title {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
        }

        .left-panel-tip {
          font-size: 1.1rem;
          opacity: 0.9;
          max-width: 350px;
          min-height: 80px;
          font-style: italic;
          line-height: 1.6;
        }

        .tip-button {
          margin-top: 1.5rem;
          background-color: rgba(255, 255, 255, 0.2);
          border: 1px solid var(--white);
          color: var(--white);
          padding: 0.6rem 1.2rem;
          border-radius: 999px;
          cursor: pointer;
          transition: background-color 0.2s;
          font-weight: 600;
        }

        .tip-button:hover {
          background-color: rgba(255, 255, 255, 0.3);
        }

        .tip-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* --- Right Form Panel --- */
        .login-right {
          padding: 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .form-greeting {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }

        .form-sub-greeting {
          color: var(--text-secondary);
          margin-bottom: 2rem;
        }

        /* --- Form Elements --- */
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .input-group label {
          font-weight: 500;
          margin-bottom: 0.5rem;
          display: block;
          font-size: 0.875rem;
        }

        .input-group input,
        .input-group select {
          width: 100%;
          box-sizing: border-box;
          padding: 0.75rem 1rem;
          border: 1px solid var(--border-color);
          border-radius: 0.5rem;
          font-size: 1rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          background-color: var(--white);
        }

        .input-group input:focus,
        .input-group select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }

        .role-description {
          margin-top: 0.75rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          border-radius: 0.375rem;
          background-color: #f3f4f6;
          color: #4b5563;
          line-height: 1.5;
        }

        .forgot-password {
          text-align: right;
          margin-top: -0.75rem;
        }

        .forgot-password a {
          color: var(--primary-color);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 500;
        }
        .forgot-password a:hover {
          text-decoration: underline;
        }

        .submit-button {
          background-color: var(--primary-color);
          color: var(--white);
          padding: 0.875rem;
          border: none;
          border-radius: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
          margin-top: 0.5rem;
        }

        .submit-button:hover {
          background-color: var(--primary-hover);
        }

        .submit-button:disabled {
          background-color: #a5b4fc;
          cursor: not-allowed;
        }

        /* --- Messages & Separators --- */
        .message {
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
          font-weight: 500;
        }

        .message.success { background-color: var(--success-bg); color: var(--success-text); }
        .message.error   { background-color: var(--error-bg);   color: var(--error-text); }
        .message.info    { background-color: var(--info-bg);    color: var(--info-text); }

        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          color: var(--text-secondary);
          margin: 1.5rem 0;
        }

        .separator::before,
        .separator::after {
          content: '';
          flex: 1;
          border-bottom: 1px solid var(--border-color);
        }

        .separator-text {
          padding: 0 1rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* --- Google Button & Form Toggle --- */
        .google-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 0.75rem 1rem;
            background-color: #ffffff;
            color: #374151;
            border: 1px solid #d1d5db;
            border-radius: 0.5rem;
            font-weight: 500;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.2s;
            gap: 0.75rem;
        }

        .google-button:hover {
            background-color: #f9fafb;
        }

        .google-icon {
            width: 1.25rem;
            height: 1.25rem;
        }

        .toggle-form {
          text-align: center;
          margin-top: 1.5rem;
          color: var(--text-secondary);
        }

        .link-button {
          background: none;
          border: none;
          color: var(--primary-color);
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          font-size: inherit;
          font-family: inherit;
        }
        .link-button:hover {
            text-decoration: underline;
        }

        /* --- Responsive Design --- */
        @media (max-width: 768px) {
          .login-container {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin: 2rem 0;
          }
          .login-left {
            display: none;
          }
          .login-right {
            padding: 2rem;
          }
        }
      `}</style>
      <div className="login-page">
        <div className="login-container">
          <div className="login-left">
            <h2 className="left-panel-title">Unlock Your Career Potential</h2>
            <p className="left-panel-tip">{careerTip}</p>
            <button onClick={generateCareerTip} className="tip-button" disabled={isTipLoading}>
              {isTipLoading ? "Generating..." : "✨ Get a New Tip"}
            </button>
          </div>
          <div className="login-right">
            <div className="login-form-container">
              <h1 className="form-greeting">{isRegister ? "Get Started" : "Welcome Back!"}</h1>
              <p className="form-sub-greeting">{isRegister ? "Create your account below." : "Please enter your details."}</p>

              {message && (
                <div className={`message ${message.includes("✅") ? "success" : message.includes("❌") ? "error" : "info"}`}>
                  {message}
                </div>
              )}

              {isRegister ? (
                <form onSubmit={handleRegister} className="auth-form">
                  <div className="input-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input type="text" id="full_name" placeholder="e.g., Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="role">Account Role</label>
                    <select id="role" value={role} onChange={handleRoleChange}>
                      <option value="free">Free</option>
                      <option value="pro">Pro</option>
                    </select>
                    {roleDescription && <p className="role-description">{roleDescription}</p>}
                  </div>
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div className="forgot-password">
                    <a href="#" onClick={handleForgotPassword}>Forgot password?</a>
                  </div>
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Signing In..." : "Sign In"}
                  </button>
                </form>
              )}

              <div className="separator"><span className="separator-text">OR</span></div>
              <GoogleAuth setMessage={setMessage} />
              <div className="toggle-form">
                <p>
                  {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
                  <button type="button" onClick={toggleForm} className="link-button">
                    {isRegister ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
