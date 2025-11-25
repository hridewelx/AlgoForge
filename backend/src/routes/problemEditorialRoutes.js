import express from "express";
import {
  generateUploadSignature,
  getEditorial,
  saveEditorial,
  addVideo,
  deleteVideo,
  saveApproach,
  deleteApproach,
  deleteEditorial,
} from "../controllers/problemEditorialControllers.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const problemEditorialRoutes = express.Router();

// Generate Cloudinary upload signature (admin only)
problemEditorialRoutes.get(
  "/create/:problemId",
  adminMiddleware,
  generateUploadSignature
);

// Get editorial for a problem (public)
problemEditorialRoutes.get("/fetch/:problemId", getEditorial);

// Save/update entire editorial (admin only)
problemEditorialRoutes.post("/save", adminMiddleware, saveEditorial);

// Video management (admin only)
problemEditorialRoutes.post("/video/add", adminMiddleware, addVideo);
problemEditorialRoutes.delete(
  "/video/:problemId/:videoId",
  adminMiddleware,
  deleteVideo
);

// Approach management (admin only)
problemEditorialRoutes.post("/approach/save", adminMiddleware, saveApproach);
problemEditorialRoutes.delete(
  "/approach/:problemId/:approachId",
  adminMiddleware,
  deleteApproach
);

// Delete entire editorial (admin only)
problemEditorialRoutes.delete(
  "/delete/:problemId",
  adminMiddleware,
  deleteEditorial
);

export default problemEditorialRoutes;
