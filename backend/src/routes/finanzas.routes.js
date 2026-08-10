import { Router } from "express";
import {
  listTransacciones,
  listResumen,
  createTransaccionHandler,
  updateTransaccionHandler,
  deleteTransaccionHandler,
} from "../controllers/finanzas.controller.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.get("/finanzas", asyncHandler(listTransacciones));
router.get("/finanzas/resumen", asyncHandler(listResumen));
router.post("/finanzas", asyncHandler(createTransaccionHandler));
router.put("/finanzas/:id", asyncHandler(updateTransaccionHandler));
router.delete("/finanzas/:id", asyncHandler(deleteTransaccionHandler));

export default router;
