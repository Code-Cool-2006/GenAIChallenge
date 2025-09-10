import React, { useState } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

const BACKEND_API_URL = "http://localhost:5000/api"; // Your backend URL

const GoogleAuth = ({ onLogin }) => {
  const [user, setUser] = useState(null);

  // Function to send the Google ID token to your custom backend for verification.
  const sendTokenToBackend = async (token) => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        const data = await response.json();
        const { user, sessionToken } = data;
        console.log("Backend verified token and returned session:", user);

        // Store the session token securely (e.g., in localStorage)
        localStorage.setItem("sessionToken", sessionToken);
        setUser(user); // Update the user state
        if (onLogin) {
          onLogin(user);
        }
      } else {
        console.error("Backend failed to verify token");
        // Handle error from backend, e.g., show a user-facing message
      }
    } catch (error) {
      console.error("Error communicating with backend", error);
      // Handle network or other communication errors
    }
  };

  // Handler for a successful Google login.
  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google login successful. Sending token to backend...");
    sendTokenToBackend(credentialResponse.credential);
  };

  // Handler for a failed Google login.
  const handleGoogleError = () => {
    console.error("Google login failed");
  };

  // Handler for logging out.
  const handleLogout = () => {
    googleLogout(); // Clears the Google session in the browser
    localStorage.removeItem("sessionToken"); // Clears our custom session token
    setUser(null); // Clear the user state
    if (onLogin) {
      onLogin(null);
    }
    console.log("User logged out.");
  };

  return (
    <div>
      {user ? (
        // Render user information and a logout button if logged in
        <div>
          <h3>Welcome, {user.name}!</h3>
          <p>Email: {user.email}</p>
          <p>ID: {user.id}</p>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      ) : (
        // Render the Google login button if not logged in
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
        />
      )}
    </div>
  );
};

export default GoogleAuth;
