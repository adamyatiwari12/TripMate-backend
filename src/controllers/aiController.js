import OpenAI from "openai";
import dotenv from "dotenv";
import prisma from "../config/db.js"; // same as in authController
dotenv.config();

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const cleanJSONResponse = (raw) => {
  const match = raw.match(/\{[\s\S]*\}/);
  const clean = match ? match[0] : "{}";
  try {
    return JSON.parse(clean);
  } catch (err) {
    console.warn("⚠️ JSON parse failed:", err.message);
    return null;
  }
};

export const generateTripPlan = async (req, res) => {
  const { messages, isFinal } = req.body;
  const userId = req.user.id; // ✅ comes from JWT middleware

  try {
    const completion = await openai.chat.completions.create({
      model: "mistralai/mistral-7b-instruct:free",
      messages: [
        {
          role: "system",
          content: isFinal
            ? "You are a JSON API. Return only JSON trip plan."
            : "You are a helpful trip planning assistant.",
        },
        ...messages,
      ],
    });

    let raw = completion.choices[0]?.message?.content ?? "";
    console.log("🧠 Raw AI Output:", raw);

    let result = cleanJSONResponse(raw);

    if (!result) {
      return res.status(400).json({ message: "AI returned invalid JSON" });
    }

    // ✅ Save trip only on final step
    if (isFinal && result.trip_plan) {
      try {
        const savedTrip = await prisma.tripDetails.create({
          data: {
            userId: userId,
            tripDetails: result.trip_plan,
          },
        });

        console.log("💾 Trip saved with id:", savedTrip.id);

        // Attach DB info to response
        result.trip_id = savedTrip.id;
        result.db_save_status = "success";
      } catch (dbError) {
        console.error("❌ Error saving trip:", dbError);
        result.db_save_status = "failed";
      }
    }

    return res.json(result);
  } catch (error) {
    console.error("🔥 AI Error:", error);
    return res.status(500).json({
      error: "AI generation failed",
      details: error.message,
    });
  }
};
