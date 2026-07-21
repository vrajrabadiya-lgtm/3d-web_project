// Must load first so EMAIL_* / MONGO_URI exist before route modules read them
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import designRoutes from "./routes/designs.js";
import contactRoutes from "./routes/contactRoutes.js";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/3d-builder";

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, same-origin) or allowed origins
    // Also allow any vercel.app subdomain for preview deployments
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin) ||
      /\.onrender\.com$/.test(origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api/designs", designRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes); 
app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "3D Web Builder API is active.",
    endpoints: {
      saveDesign: "POST /api/designs",
      getDesigns: "GET /api/designs/:userId",
      deleteDesign: "DELETE /api/designs/:id",
      submitContactMessage: "POST /api/contact",
      projectRoutes: "CRUD /api/projects"
    }
  });
});

// Database connection & Server startup
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas / Local Database successfully.");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
