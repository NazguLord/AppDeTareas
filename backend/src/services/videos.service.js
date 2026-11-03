import { db } from "../config/db.js";
import { insertVideosQuery, listVideosQuery, updateVideoQuery, videoFields } from "../queries/videos.queries.js";
import { AppError } from "../utils/http.js";

const valuesFor = (row) => {
  if (!String(row.nombreBanda || "").trim()) throw new AppError(400, "La banda es obligatoria.");
  return videoFields.map((field) => field === "categoria" ? "Video" : field === "genero_id" ? (row[field] ? Number(row[field]) : null) : String(row[field] ?? "").trim());
};
export const listVideos = async () => (await db.query(listVideosQuery))[0];
export const insertVideos = async (rows) => {
  if (!Array.isArray(rows) || !rows.length) throw new AppError(400, "No hay videos para importar.");
  const values = rows.map(valuesFor);
  const [result] = await db.query(insertVideosQuery, [values]);
  return { insertedRows: result.affectedRows };
};
export const updateVideo = async (id, row) => {
  const [result] = await db.query(updateVideoQuery, [...valuesFor(row), id]);
  if (!result.affectedRows) throw new AppError(404, "Video no encontrado.");
  return { message: "Video actualizado correctamente." };
};
