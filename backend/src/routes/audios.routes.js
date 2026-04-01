import { Router } from "express";
import { listAudioFormatos, listAudioGeneros, listAudioTipos, listAudios, updateAudioHandler } from "../controllers/audios.controller.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.get("/catalogos/audio-formatos", asyncHandler(listAudioFormatos));
router.get("/catalogos/audio-tipos", asyncHandler(listAudioTipos));
router.get("/catalogos/audio-generos", asyncHandler(listAudioGeneros));
router.get("/audios", asyncHandler(listAudios));
router.put("/audios/:id", asyncHandler(updateAudioHandler));

export default router;
