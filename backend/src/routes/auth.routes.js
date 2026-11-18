import { Router } from "express";
import { login, logout, session } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.post("/login", asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.get("/session", requireAuth, asyncHandler(session));

export default router;
