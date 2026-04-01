import { Router } from "express";
import authRoutes from "./auth.routes.js";
import contactosRoutes from "./contactos.routes.js";
import tareasRoutes from "./tareas.routes.js";
import medicamentosRoutes from "./medicamentos.routes.js";
import audiosRoutes from "./audios.routes.js";
import bootlegsRoutes from "./bootlegs.routes.js";
import uploadRoutes from "./upload.routes.js";

const router = Router();

router.get("/", (req, res) => {
  res.json("Hola esta es el backend");
});

router.use(uploadRoutes);
router.use(authRoutes);
router.use("/contactos", contactosRoutes);
router.use("/medicamentos", medicamentosRoutes);
router.use(audiosRoutes);
router.use(bootlegsRoutes);
router.use(tareasRoutes);

export default router;
