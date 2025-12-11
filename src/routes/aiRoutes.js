import express from "express";
import { generateTripPlan } from "../controllers/aiController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/",protectRoute, generateTripPlan);

export default router;
