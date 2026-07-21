import express from "express";
import Project from "../models/Project.js";
import { authMiddleware } from "./auth.js";

const router = express.Router();

// All project routes require authentication
router.use(authMiddleware);

// POST /api/projects
router.post("/", async (req, res) => {
  try {
    const { title, prompt, thumbnail, metadata } = req.body;

    if (!title || !prompt) {
      return res.status(400).json({
        success: false,
        message: "Title and prompt are required fields."
      });
    }

    const newProject = new Project({
      userId: req.userId,
      title,
      prompt,
      thumbnail,
      metadata: metadata || {}
    });

    const savedProject = await newProject.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: savedProject
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return res.status(500).json({ success: false, message: "Server error creating project." });
  }
});

// GET /api/projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Projects retrieved successfully.",
      data: projects
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ success: false, message: "Server error retrieving projects." });
  }
});

// GET /api/projects/:id
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to access this project." });
    }

    return res.status(200).json({
      success: true,
      message: "Project retrieved successfully.",
      data: project
    });
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({ success: false, message: "Server error retrieving project." });
  }
});

// PATCH /api/projects/:id
router.patch("/:id", async (req, res) => {
  try {
    const { title, prompt, status, progress, thumbnail, metadata } = req.body;
    
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to modify this project." });
    }

    if (title) project.title = title;
    if (prompt) project.prompt = prompt;
    if (status) project.status = status;
    if (progress !== undefined) project.progress = progress;
    if (thumbnail !== undefined) project.thumbnail = thumbnail;
    if (metadata) project.metadata = { ...project.metadata, ...metadata };

    const updatedProject = await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: updatedProject
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ success: false, message: "Server error updating project." });
  }
});

// DELETE /api/projects/:id
router.delete("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found." });
    }

    if (project.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this project." });
    }

    await Project.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully.",
      data: null
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ success: false, message: "Server error deleting project." });
  }
});

export default router;
