import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://trip-mate-frontend.vercel.app"
];

// ✅ place this at the very top, before routes or body parsers
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ respond to all preflight (OPTIONS) requests
app.options(/.*/, cors({
  origin: ["http://localhost:3000", "https://tripmate.vercel.app"],
  credentials: true
}));

app.use(express.json());

// ✅ your routes below
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("TripMate Auth API running 🚀"));

export default app;
