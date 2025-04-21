import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import db from "./config/db.js";
import { getTanscheDashboardStats } from './models/jobModel.js'; // Import the function for fetching stats

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // your frontend Vite dev server
    credentials: true               // allow sending cookies/session
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Tansche Dashboard route
app.get("/api/tansche/dashboard", (req, res) => {
  getTanscheDashboardStats((err, stats) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching dashboard data" });
    }
    res.json(stats); // Send the stats as JSON
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("🌐 Competency Mapping API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
