import express from "express";
import { upload } from "../config/multer.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { analyzeResumePDF } from "../controllers/resume.controller.js";

const router = express.Router();

router.post("/analyze-pdf",upload.single("resume"),authMiddleware,analyzeResumePDF);

export default router;