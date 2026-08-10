import {
  getAllTransacciones,
  getTransaccionesByTipo,
  getTransaccionesByMoneda,
  getResumen,
  createTransaccion,
  updateTransaccion,
  deleteTransaccion,
} from "../services/finanzas.service.js";

export const listTransacciones = async (req, res) => {
  const { tipo, moneda } = req.query;

  if (tipo) {
    return res.json(await getTransaccionesByTipo(tipo));
  }
  if (moneda) {
    return res.json(await getTransaccionesByMoneda(moneda));
  }

  res.json(await getAllTransacciones());
};

export const listResumen = async (req, res) => res.json(await getResumen());

export const createTransaccionHandler = async (req, res) =>
  res.json(await createTransaccion(req.body));

export const updateTransaccionHandler = async (req, res) =>
  res.json(await updateTransaccion(req.params.id, req.body));

export const deleteTransaccionHandler = async (req, res) =>
  res.json(await deleteTransaccion(req.params.id));
