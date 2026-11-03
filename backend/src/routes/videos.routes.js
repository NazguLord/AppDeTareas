import { Router } from "express";
import { uploadWorkbook } from "../middlewares/upload.js";
import { listVideos, insertVideos, updateVideo } from "../services/videos.service.js";
import { parseVideoWorkbook } from "../utils/videos.js";
import { AppError, asyncHandler } from "../utils/http.js";

const router = Router();
router.get("/videos", asyncHandler(async (req, res) => res.json(await listVideos())));
router.post("/videos", asyncHandler(async (req, res) => res.status(201).json(await insertVideos([req.body]))));
router.put("/videos/:id", asyncHandler(async (req, res) => res.json(await updateVideo(req.params.id, req.body))));
router.post("/videos/import/preview", uploadWorkbook.single("file"), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError(400, "Selecciona un archivo Excel.");
  res.json(parseVideoWorkbook(req.file.buffer));
}));
router.post("/videos/import", asyncHandler(async (req, res) => res.status(201).json(await insertVideos(req.body.rows))));
export default router;
