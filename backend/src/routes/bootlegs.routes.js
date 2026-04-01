import { Router } from "express";
import { createBootlegHandler, importBootlegsHandler, previewBootlegImportHandler } from "../controllers/bootlegs.controller.js";
import { uploadWorkbook } from "../middlewares/upload.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.post("/form", asyncHandler(createBootlegHandler));
router.post("/bootlegs/import/preview", uploadWorkbook.single("file"), asyncHandler(previewBootlegImportHandler));
router.post("/bootlegs/import", asyncHandler(importBootlegsHandler));

export default router;
