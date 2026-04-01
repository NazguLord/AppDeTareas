import { Router } from "express";
import { uploadFileHandler } from "../controllers/upload.controller.js";
import { uploadGeneralFile } from "../middlewares/upload.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.post("/upload", uploadGeneralFile.single("file"), asyncHandler(uploadFileHandler));

export default router;
