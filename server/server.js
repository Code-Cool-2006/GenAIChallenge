// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's URL
  })
);
app.use(express.json());

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET;

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post("/api/auth/google", async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: "No token provided." });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // TODO: Look up the user in your database using `sub` or `email`
    // If user does not exist, create a new user entry
    // If they exist, get their user data

    // For this example, we will just use the payload
    const user = { id: sub, email, name, picture };

    // Create a new JWT for your session
    const sessionToken = jwt.sign(user, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      sessionToken,
    });
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Invalid token." });
  }
});

// A protected route example
app.get("/api/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided." });
  }

  try {
    const user = jwt.verify(token, JWT_SECRET);
    res
      .status(200)
      .json({ message: "Profile data retrieved successfully.", user });
  } catch (error) {
    res.status(403).json({ message: "Invalid session token." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
