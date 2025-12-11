import prisma from "../config/db.js";

export const createTrip = async (req, res) => {
  try {
    const { tripDetails } = req.body;

    if (!tripDetails) {
      return res.status(400).json({ message: "Trip details are required" });
    }

    const newTrip = await prisma.tripDetails.create({
      data: {
        userId: req.user.id, // from authMiddleware
        tripDetails: tripDetails,
      },
    });

    res.status(201).json({
      message: "Trip created successfully",
      trip: newTrip,
    });
  } catch (error) {
    console.error("Create Trip Error:", error);
    res.status(500).json({ message: "Server error while creating trip" });
  }
};

export const getUserTrips = async (req, res) => {
  try {
    const trips = await prisma.tripDetails.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        id: 'desc', // Assuming we want newest first, though createdAt isn't in model, id usually works for chronological
      },
    });

    res.status(200).json(trips);
  } catch (error) {
    console.error("Get User Trips Error:", error);
    res.status(500).json({ message: "Server error while fetching trips" });
  }
};

export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;

    const trip = await prisma.tripDetails.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Ensure the trip belongs to the requesting user
    if (trip.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to access this trip" });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error("Get Trip By ID Error:", error);
    res.status(500).json({ message: "Server error while fetching trip details" });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if trip exists and belongs to user
    const trip = await prisma.tripDetails.findUnique({
      where: { id: parseInt(id) },
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this trip" });
    }

    await prisma.tripDetails.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: "Trip deleted successfully" });
  } catch (error) {
    console.error("Delete Trip Error:", error);
    res.status(500).json({ message: "Server error while deleting trip" });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { tripDetails } = req.body;

    const trip = await prisma.tripDetails.findUnique({
      where: { id: parseInt(id) },
    });

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this trip" });
    }

    const updatedTrip = await prisma.tripDetails.update({
      where: { id: parseInt(id) },
      data: { tripDetails },
    });

    res.status(200).json({ message: "Trip updated successfully", trip: updatedTrip });
  } catch (error) {
    console.error("Update Trip Error:", error);
    res.status(500).json({ message: "Server error while updating trip" });
  }
};
