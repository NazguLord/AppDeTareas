import { db } from "../config/db.js";
import { deleteTareaQuery, getRecentTareasQuery, getRegistrosQuery, getTotalTareasQuery, insertTareaQuery, updateTareaQuery } from "../queries/tareas.queries.js";
import { getCurrentTimestamp } from "../utils/date.js";

export const getRecentTareas = async () => {
  const [rows] = await db.query(getRecentTareasQuery);
  return rows;
};

export const getRegistros = async () => {
  const [rows] = await db.query(getRegistrosQuery);
  return rows;
};

export const getTotalTareas = async () => {
  const [rows] = await db.query(getTotalTareasQuery);
  return rows;
};

export const createTarea = async ({ tituloTarea, cantidad }) => {
  const values = [tituloTarea, cantidad, getCurrentTimestamp()];
  const [result] = await db.query(insertTareaQuery, [values]);
  return result;
};

export const deleteTarea = async (tareaId) => {
  await db.query(deleteTareaQuery, [tareaId]);
  return "La tarea se ha eliminado satisfactoriamente.";
};

export const updateTarea = async (tareaId, { tituloTarea, cantidad }) => {
  const values = [tituloTarea, cantidad];
  await db.query(updateTareaQuery, [...values, tareaId]);
  return "La tarea se ha actualizado satisfactoriamente.";
};
