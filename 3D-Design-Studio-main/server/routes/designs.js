import express from "express";
import Design from "../models/Design.js";

const router = express.Router();

// POST /api/designs - Save a new customized 3D design configuration
router.post("/", async (req, res) => {
  try {
    const { userId, designName, config, imageUrl } = req.body;

    if (!userId || !designName || !config) {
      return res.status(400).json({ error: "Missing required fields (userId, designName, config)" });
    }

    const newDesign = new Design({
      userId,
      designName,
      config,
      imageUrl: imageUrl || "",
    });

    const savedDesign = await newDesign.save();
    return res.status(201).json(savedDesign);
  } catch (error) {
    console.error("Error saving design:", error);
    return res.status(500).json({ error: "Failed to save design. Server error." });
  }
});

// GET /api/designs/:userId - Retrieve all saved designs for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const designs = await Design.find({ userId }).sort({ createdAt: -1 });
    return res.status(200).json(designs);
  } catch (error) {
    console.error("Error fetching designs:", error);
    return res.status(500).json({ error: "Failed to retrieve designs. Server error." });
  }
});

// DELETE /api/designs/:id - Delete a specific design by its ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDesign = await Design.findByIdAndDelete(id);
    if (!deletedDesign) {
      return res.status(404).json({ error: "Design not found" });
    }
    return res.status(200).json({ message: "Design deleted successfully", id });
  } catch (error) {
    console.error("Error deleting design:", error);
    return res.status(500).json({ error: "Failed to delete design. Server error." });
  }
});

export default router;
