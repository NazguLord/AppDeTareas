import { db } from "../config/db.js";
import {
  getAllTransaccionesQuery,
  getTransaccionesByTipoQuery,
  getTransaccionesByMonedaQuery,
  getResumenQuery,
  insertTransaccionQuery,
  updateTransaccionQuery,
  deleteTransaccionQuery,
} from "../queries/finanzas.queries.js";

export const getAllTransacciones = async () => {
  const [rows] = await db.query(getAllTransaccionesQuery);
  return rows;
};

export const getTransaccionesByTipo = async (tipo) => {
  const [rows] = await db.query(getTransaccionesByTipoQuery, [tipo]);
  return rows;
};

export const getTransaccionesByMoneda = async (moneda) => {
  const [rows] = await db.query(getTransaccionesByMonedaQuery, [moneda]);
  return rows;
};

export const getResumen = async () => {
  const [rows] = await db.query(getResumenQuery);
  return rows;
};

export const createTransaccion = async ({ tipo, monto, moneda, descripcion, fecha }) => {
  const values = [tipo, monto, moneda, descripcion, fecha];
  const [result] = await db.query(insertTransaccionQuery, [values]);
  return result;
};

export const updateTransaccion = async (id, { tipo, monto, moneda, descripcion, fecha }) => {
  await db.query(updateTransaccionQuery, [tipo, monto, moneda, descripcion, fecha, id]);
  return "Transaccion actualizada satisfactoriamente.";
};

export const deleteTransaccion = async (id) => {
  await db.query(deleteTransaccionQuery, [id]);
  return "Transaccion eliminada satisfactoriamente.";
};
