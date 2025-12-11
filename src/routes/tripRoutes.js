import express from "express";
import { createTrip, getUserTrips, getTripById, deleteTrip, updateTrip } from "../controllers/tripController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/trips/create
router.post("/create", protectRoute, createTrip);

// GET /api/trips - Get all trips for the authenticated user
router.get("/", protectRoute, getUserTrips);

// GET /api/trips/:id - Get a specific trip
router.get("/:id", protectRoute, getTripById);

// DELETE /api/trips/:id - Delete a trip
router.delete("/:id", protectRoute, deleteTrip);

// PUT /api/trips/:id - Update a trip
router.put("/:id", protectRoute, updateTrip);

export default router;
