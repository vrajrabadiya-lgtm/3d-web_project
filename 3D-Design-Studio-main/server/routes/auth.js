import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "3d_studio_secret_key_change_in_prod";

// ─── Middleware: verify JWT token ────────────────────────────────────────────
export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// ─── SIGNUP ──────────────────────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Account created successfully!",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(404).json({ message: "No account found with this email." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password." });

    // Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── GET CURRENT USER (protected) ────────────────────────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
