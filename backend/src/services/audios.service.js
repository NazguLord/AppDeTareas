import { db } from "../config/db.js";
import { getAudioFormatosQuery, getAudioGenerosQuery, getAudioTiposQuery, getAudiosQuery, updateAudioQuery } from "../queries/audios.queries.js";
import { normalizeBootlegDate } from "../utils/bootlegs.js";

const mapCatalogRows = (rows = []) =>
  rows.map((row) => ({
    id: row.id,
    codigo: row.codigo,
    nombre: row.nombre,
    descripcion: row.descripcion,
  }));

export const getAudioFormatos = async () => {
  const [rows] = await db.query(getAudioFormatosQuery);
  return mapCatalogRows(rows);
};

export const getAudioTipos = async () => {
  const [rows] = await db.query(getAudioTiposQuery);
  return mapCatalogRows(rows);
};

export const getAudioGeneros = async () => {
  const [rows] = await db.query(getAudioGenerosQuery);
  return mapCatalogRows(rows);
};

export const getAudios = async () => {
  const [rows] = await db.query(getAudiosQuery);
  return rows;
};

export const updateAudio = async (audioId, body) => {
  const normalizedDate = normalizeBootlegDate(body.fecha);
  const values = [
    body.nombreBanda || "",
    body.lugar || "",
    normalizedDate.value || null,
    body.tipo || "",
    body.genero_id === "" || body.genero_id === undefined || body.genero_id === null ? null : Number(body.genero_id),
    body.cantidadDiscos === "" || body.cantidadDiscos === undefined ? null : Number(body.cantidadDiscos),
    body.formato || "",
    body.version || null,
    body.almacenamiento || "",
    body.comentario || null,
    body.categoria || "",
    body.peso || "",
    body.negociable || "",
  ];

  await db.query(updateAudioQuery, [...values, audioId]);
  return { message: "El audio se actualizo correctamente." };
};
