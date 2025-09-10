import React, { useState } from "react";
import GoogleAuth from "./GoogleAuth"; // optional
import "./LoginPage.css";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setMessage("");
    setFullName("");
    setEmail("");
    setPassword("");
  };

  // ✅ Register handler
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Registration successful. Please login.");
        setIsRegister(false);
      } else {
        setMessage(`❌ ${data.msg || "Registration failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error during registration.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Login successful.");
        // 👉 Optional: redirect to dashboard
      } else {
        setMessage(`❌ ${data.msg || "Invalid credentials"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Server error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left section */}
      <div className="login-left">
        <div className="illustration">
          <img
            width="500"
            height="500"
            src="./20945760.jpg"
            alt="Illustration"
          />
        </div>
        <p className="login-tip">
          {isRegister
            ? "Create your Account to get full User Experience"
            : "Login your Account to get full User Experience"}
        </p>
        <p className="login-upgrade-tip">
          Tips: Upgrade your Account to get access Premium Features
        </p>
      </div>

      {/* Right section */}
      <div className="login-right">
        <div className="login-form-container">
          <h2>
            Hello! <br /> Good Morning
          </h2>
          <p>
            <strong>{isRegister ? "Create" : "Login"}</strong> your account
          </p>

          {/* Show messages */}
          {message && <div className="message">{message}</div>}

          {/* Register Form */}
          {isRegister ? (
            <form onSubmit={handleRegister}>
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                placeholder="Your name"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                required
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>

              <div className="toggle-form">
                <p>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="link-button"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="forgot-password">
                <a href="#">Forgot password?</a>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>

              <div className="toggle-form">
                <p>
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleForm}
                    className="login-button"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* Google login */}
          <div className="google-auth-section">
            <p>Or login with</p>
            <GoogleAuth />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
