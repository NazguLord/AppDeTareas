import { Router } from "express";
import { createContactoHandler, deleteContactoHandler, listContactos, updateContactoHandler } from "../controllers/contactos.controller.js";
import { asyncHandler } from "../utils/http.js";

const router = Router();

router.get("/", asyncHandler(listContactos));
router.post("/", asyncHandler(createContactoHandler));
router.delete("/:id", asyncHandler(deleteContactoHandler));
router.put("/:id/edit", asyncHandler(updateContactoHandler));

export default router;
