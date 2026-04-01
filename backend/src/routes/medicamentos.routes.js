import { Router } from "express";
import { createMedicamentoHandler, listMedicamentos, updateMedicamentoHandler } from "../controllers/medicamentos.controller.js";
import { uploadMedicineImage } from "../middlewares/upload.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.get("/", asyncHandler(listMedicamentos));
router.post("/", uploadMedicineImage.single("imagen"), asyncHandler(createMedicamentoHandler));
router.put("/:id", uploadMedicineImage.single("imagen"), asyncHandler(updateMedicamentoHandler));

export default router;
