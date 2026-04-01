import { Router } from "express";
import { createTareaHandler, deleteTareaHandler, getTotal, listRecentTareas, listRegistros, updateTareaHandler } from "../controllers/tareas.controller.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.get("/tareas", asyncHandler(listRecentTareas));
router.get("/registros", asyncHandler(listRegistros));
router.get("/total", asyncHandler(getTotal));
router.post("/tareas", asyncHandler(createTareaHandler));
router.delete("/tareas/:id", asyncHandler(deleteTareaHandler));
router.put("/tareas/:id", asyncHandler(updateTareaHandler));

export default router;
