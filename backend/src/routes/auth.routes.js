import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/logout", asyncHandler(logout));

export default router;
