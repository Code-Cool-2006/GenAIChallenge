import React, { useState } from "react";

// --- GoogleAuth Component (Placeholder) ---
const GoogleAuth = ({ setMessage }) => {
  const handleGoogleLogin = () => {
    setMessage("ℹ️ Google login is a placeholder feature.");
  };

  const googleButtonStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '100%', padding: '0.75rem 1rem', backgroundColor: '#ffffff',
    color: '#374151', border: '1px solid #d1d5db', borderRadius: '0.5rem',
    fontWeight: '500', fontSize: '1rem', cursor: 'pointer',
    transition: 'background-color 0.2s', gap: '0.75rem'
  };

  const googleIconStyle = { width: '1.25rem', height: '1.25rem' };

  return (
    <button style={googleButtonStyle} onClick={handleGoogleLogin}>
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google icon"
        style={googleIconStyle}
      />
      Sign in with Google
    </button>
  );
};

// --- Main LoginPage Component ---
const LoginPage = () => {
  // Backend server ka address
  const API_BASE_URL = "http://localhost:8000";

  // IMPORTANT: Yahan apni Gemini API key daalein
  // Aap Google AI Studio se key le sakte hain
  const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-1.5-latest:generateContent?key=${GEMINI_API_KEY}`;

  // State variables
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("free");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [careerTip, setCareerTip] = useState("Your journey to a new career starts here. Login or create an account to continue.");
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [roleDescription, setRoleDescription] = useState("");
  const [isRoleDescLoading, setIsRoleDescLoading] = useState(false);

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setMessage(""); setFullName(""); setEmail(""); setPassword(""); setRole("free"); setRoleDescription("");
  };

  const callGemini = async (prompt) => {
    if (!GEMINI_API_KEY || GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
        return "Gemini API Key is missing. Please add it to the code.";
    }
    const payload = { contents: [{ parts: [{ text: prompt }] }] };
    const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        throw new Error(`API call failed with status: ${response.status}`);
    }
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text;
  }

  const generateCareerTip = async () => {
    setIsTipLoading(true);
    setCareerTip("Generating a new tip...");
    try {
      const text = await callGemini("Give a single, concise, and inspiring career tip for a tech professional. Do not use quotes.");
      setCareerTip(text || "Failed to load tip. Try again.");
    } catch (err) {
      console.error("Gemini API error:", err);
      setCareerTip("Failed to generate tip. Please try again.");
    } finally {
      setIsTipLoading(false);
    }
  };
  
  const getRoleDescription = async (selectedRole) => {
    if(!selectedRole) return;
    setIsRoleDescLoading(true);
    setRoleDescription(`Fetching description for ${selectedRole} role...`);
    try {
        const prompt = `Provide a concise, single-paragraph description for a '${selectedRole}' account on a career and professional development platform. Highlight the key benefits.`;
        const text = await callGemini(prompt);
        setRoleDescription(text || "Failed to load description. Try again.");
    } catch (err) {
        console.error("Gemini API error:", err);
        setRoleDescription("Failed to get description. Please try again.");
    } finally {
        setIsRoleDescLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setLoading(true); setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, email, password, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Registration successful! Please proceed to login.");
        setIsRegister(false);
      } else {
        setMessage(`❌ ${data.msg || "Registration failed. Please try again."}`);
      }
    } catch (err) {
      console.error("Registration Fetch Error:", err);
      setMessage("❌ An error occurred. Please check the console.");
    } finally { setLoading(false); }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setLoading(true); setMessage("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.access_token);
        setMessage("✅ Login successful! Redirecting...");
      } else {
        setMessage(`❌ ${data.msg || "Invalid credentials provided."}`);
      }
    } catch (err) {
      console.error("Login Fetch Error:", err);
      setMessage("❌ An error occurred. Please check the console.");
    } finally { setLoading(false); }
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setRole(selectedRole);
    getRoleDescription(selectedRole);
  };

  return (
    <>
      <style>{`
        :root { --primary-color: #6366f1; --primary-hover: #4f46e5; --text-primary: #1f2937; --text-secondary: #6b7280; --background-light: #f9fafb; --border-color: #d1d5db; --success-bg: #dcfce7; --success-text: #166534; --error-bg: #fee2e2; --error-text: #991b1b; --info-bg: #e0f2fe; --info-text: #075985; --white: #ffffff; --box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); --font-family: 'Inter', sans-serif; }
        body { font-family: var(--font-family); background-color: var(--background-light); margin: 0; color: var(--text-primary); }
        .login-page { display: flex; justify-content: center; align-items: center; min-height: 100vh; padding: 1.5rem; box-sizing: border-box; }
        .login-container { display: grid; grid-template-columns: 1fr 1fr; width: 100%; max-width: 64rem; background-color: var(--white); border-radius: 1rem; box-shadow: var(--box-shadow); overflow: hidden; }
        .login-left { background-color: var(--primary-color); color: var(--white); padding: 3rem; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
        .left-panel-title { font-size: 1.875rem; font-weight: 700; margin-bottom: 1rem; }
        .left-panel-tip { font-size: 1.1rem; opacity: 0.9; max-width: 350px; min-height: 80px; font-style: italic; }
        .tip-button { margin-top: 1.5rem; background-color: rgba(255,255,255,0.2); border: 1px solid var(--white); color: var(--white); padding: 0.6rem 1.2rem; border-radius: 999px; cursor: pointer; transition: background-color 0.2s; font-weight: 600; }
        .tip-button:hover { background-color: rgba(255,255,255,0.3); }
        .tip-button:disabled { opacity: 0.7; cursor: not-allowed; }
        .login-right { padding: 3rem; display: flex; flex-direction: column; justify-content: center; }
        .form-greeting { font-size: 2.25rem; font-weight: 800; margin-bottom: 0.5rem; }
        .form-sub-greeting { color: var(--text-secondary); margin-bottom: 2rem; }
        .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
        .input-group label { font-weight: 500; margin-bottom: 0.5rem; display: block; font-size: 0.875rem; }
        .input-group input, .input-group select { width: 100%; box-sizing: border-box; padding: 0.75rem 1rem; border: 1px solid var(--border-color); border-radius: 0.5rem; font-size: 1rem; transition: border-color 0.2s, box-shadow 0.2s; background-color: var(--white); }
        .input-group input:focus, .input-group select:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2); }
        .role-description { margin-top: 0.75rem; padding: 0.5rem 0.75rem; font-size: 0.875rem; border-radius: 0.375rem; background-color: #f3f4f6; color: #4b5563; }
        .forgot-password { text-align: right; margin-top: -0.75rem; }
        .forgot-password a { color: var(--primary-color); text-decoration: none; font-size: 0.875rem; font-weight: 500; }
        .submit-button { background-color: var(--primary-color); color: var(--white); padding: 0.875rem; border: none; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background-color 0.2s; margin-top: 0.5rem; }
        .submit-button:hover { background-color: var(--primary-hover); }
        .submit-button:disabled { background-color: #a5b4fc; cursor: not-allowed; }
        .message { padding: 0.75rem 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem; text-align: center; font-weight: 500; }
        .message.success { background-color: var(--success-bg); color: var(--success-text); }
        .message.error { background-color: var(--error-bg); color: var(--error-text); }
        .message.info { background-color: var(--info-bg); color: var(--info-text); }
        .separator { display: flex; align-items: center; text-align: center; color: var(--text-secondary); margin: 1.5rem 0; }
        .separator::before, .separator::after { content: ''; flex: 1; border-bottom: 1px solid var(--border-color); }
        .separator-text { padding: 0 1rem; font-size: 0.875rem; font-weight: 500; }
        .toggle-form { text-align: center; margin-top: 1.5rem; color: var(--text-secondary); }
        .link-button { background: none; border: none; color: var(--primary-color); font-weight: 600; cursor: pointer; padding: 0; font-size: inherit; font-family: inherit; }
        @media (max-width: 768px) { .login-container { grid-template-columns: 1fr; max-width: 480px; } .login-left { display: none; } .login-right { padding: 2rem; } }
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
              {message && <div className={`message ${message.includes("✅") ? "success" : message.includes("❌") ? "error" : "info"}`}>{message}</div>}
              {isRegister ? (
                <form onSubmit={handleRegister} className="auth-form">
                  <div className="input-group"><label htmlFor="full_name">Full Name</label><input type="text" id="full_name" placeholder="e.g., Jane Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} required /></div>
                  <div className="input-group"><label htmlFor="email">Email Address</label><input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div className="input-group"><label htmlFor="password">Password</label><input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                  <div className="input-group">
                    <label htmlFor="role">Account Role</label>
                    <select id="role" value={role} onChange={handleRoleChange}>
                      <option value="free">Free</option><option value="pro">Pro</option>
                    </select>
                    {roleDescription && <p className="role-description">{roleDescription}</p>}
                  </div>
                  <button type="submit" className="submit-button" disabled={loading}>{loading ? "Creating Account..." : "Create Account"}</button>
                </form>
              ) : (
                <form onSubmit={handleLogin} className="auth-form">
                  <div className="input-group"><label htmlFor="email">Email Address</label><input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div className="input-group"><label htmlFor="password">Password</label><input type="password" id="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                  <div className="forgot-password"><a href="#">Forgot password?</a></div>
                  <button type="submit" className="submit-button" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
                </form>
              )}
              <div className="separator"><span className="separator-text">OR</span></div>
              <GoogleAuth setMessage={setMessage} />
              <div className="toggle-form">
                <p>
                  {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
                  <button type="button" onClick={toggleForm} className="link-button">{isRegister ? "Sign In" : "Sign Up"}</button>
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

