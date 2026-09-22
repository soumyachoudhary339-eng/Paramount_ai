import express from "express";
import { getMe, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me",authMiddleware,getMe)
router.post('/logout', authMiddleware, logoutUser);

export default router;