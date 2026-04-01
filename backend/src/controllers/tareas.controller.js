import { createTarea, deleteTarea, getRecentTareas, getRegistros, getTotalTareas, updateTarea } from "../services/tareas.service.js";

export const listRecentTareas = async (req, res) => res.json(await getRecentTareas());
export const listRegistros = async (req, res) => res.json(await getRegistros());
export const getTotal = async (req, res) => res.json(await getTotalTareas());
export const createTareaHandler = async (req, res) => res.json(await createTarea(req.body));
export const deleteTareaHandler = async (req, res) => res.json(await deleteTarea(req.params.id));
export const updateTareaHandler = async (req, res) => res.json(await updateTarea(req.params.id, req.body));
