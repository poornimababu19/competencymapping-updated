import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import { getTanscheStats } from "./controllers/jobController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // your frontend Vite dev server
  credentials: true                 // allow sending cookies/session
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Tansche Dashboard route
app.get("/api/tansche/dashboard", getTanscheStats);

// Root route
app.get("/", (req, res) => {
  res.send("🌐 Competency Mapping API is running");
});

app.use("/api/notifications", notificationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
