import { db } from "../config/db.js";
import { MEDICAMENTOS_TABLE } from "../constants/tables.js";
import { getMedicineColumnsQuery, getMedicamentosQuery } from "../queries/medicamentos.queries.js";
import { getCurrentTimestamp } from "../utils/date.js";
import { buildMedicinePayload } from "../utils/medicine.js";

export const getMedicineColumns = async () => {
  const [rows] = await db.query(getMedicineColumnsQuery);
  return rows;
};

export const getMedicineIdColumn = async () => {
  const columns = await getMedicineColumns();
  const prioritized = ["id", "idmedicamentos", "idMedicamentos", "id_medicamentos", "idmedicamento", "idMedicamento", "id_medicamento"];
  const priorityMatch = prioritized.find((candidate) => columns.some((column) => column.Field === candidate));
  const primaryMatch = columns.find((column) => column.Key === "PRI");
  const fallback = columns[0]?.Field;

  return priorityMatch || primaryMatch?.Field || fallback || "id";
};

export const getMedicamentos = async () => {
  const [rows] = await db.query(getMedicamentosQuery);
  return rows;
};

export const createMedicamento = async (body, imagen) => {
  const columns = await getMedicineColumns();
  const payload = buildMedicinePayload(body, imagen, true, getCurrentTimestamp());
  const availableEntries = Object.entries(payload).filter(([field]) => columns.some((column) => column.Field === field));
  const query = `INSERT INTO ${MEDICAMENTOS_TABLE} (${availableEntries.map(([field]) => `\`${field}\``).join(", ")}) VALUES (?)`;
  const values = availableEntries.map(([, value]) => value);
  const [result] = await db.query(query, [values]);
  return result;
};

export const updateMedicamento = async (medicamentoId, body, imagen) => {
  const columns = await getMedicineColumns();
  const idColumn = await getMedicineIdColumn();
  const payload = buildMedicinePayload(body, imagen, false);
  const availableEntries = Object.entries(payload).filter(([field]) => columns.some((column) => column.Field === field));
  const query = `UPDATE ${MEDICAMENTOS_TABLE} SET ${availableEntries.map(([field]) => `\`${field}\` = ?`).join(", ")} WHERE \`${idColumn}\` = ?`;
  const values = availableEntries.map(([, value]) => value);

  await db.query(query, [...values, medicamentoId]);
  return { message: "El medicamento se actualizo correctamente.", imagen };
};
