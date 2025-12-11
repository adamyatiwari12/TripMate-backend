import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  // "https://trip-mate-frontend.vercel.app"
];

// ✅ place this at the very top, before routes or body parsers
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like mobile apps, Postman)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // ✅ respond to all preflight (OPTIONS) requests
// app.options(/.*/, cors({
//   origin: ["http://localhost:3000", "https://tripmate.vercel.app"],
//   credentials: true
// }));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("❌ CORS blocked request from:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());

import tripRoutes from "./routes/tripRoutes.js";

// ... imports

// ✅ your routes below
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/trips", tripRoutes);


app.get("/", (req, res) => res.send("TripMate Auth API running 🚀"));

export default app;
