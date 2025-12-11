import jwt from "jsonwebtoken";
import prisma from "../config/db.js"; // same prisma import you use in authController

export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Expect: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = authHeader.split(" ")[1];

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(404).json({ message: "User associated with token not found" });
    }

    // Attach user to request object (so controllers can use req.user)
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};
