import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import tripRoutes from "./routes/tripRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://trip-mate-frontend.vercel.app",
];

// 🔹 CORS middleware (global, before routes)
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, curl)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn("❌ CORS blocked request from:", origin);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// 🔹 Explicitly handle ALL preflight (OPTIONS) requests
app.options(/.*/, cors(corsOptions));

app.use(express.json());

// ✅ routes
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/trips", tripRoutes);

app.get("/", (req, res) => res.send("TripMate Auth API running 🚀"));

export default app;
