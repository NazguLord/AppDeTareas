import { createMedicamento, getMedicamentos, updateMedicamento } from "../services/medicamentos.service.js";

export const listMedicamentos = async (req, res) => res.json(await getMedicamentos());

export const createMedicamentoHandler = async (req, res) => {
  const imagen = req.file?.filename || null;
  return res.json(await createMedicamento(req.body, imagen));
};

export const updateMedicamentoHandler = async (req, res) => {
  const imagen = req.file?.filename || req.body.imagenActual || null;
  return res.status(200).json(await updateMedicamento(req.params.id, req.body, imagen));
};
