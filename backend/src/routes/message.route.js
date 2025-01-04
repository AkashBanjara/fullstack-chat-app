import express from "express";
import { protectRoute } from "../middleware/authMiddleware.js";
import { getMessage, getUserForSlider, sendMessage } from "../controllers/messageController.js";
const router = express.Router()

router.get("/users", protectRoute, getUserForSlider)
router.get("/:id", protectRoute, getMessage)

router.post("/send/:id", protectRoute, sendMessage )

export default router;