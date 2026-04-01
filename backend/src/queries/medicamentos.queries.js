import { MEDICAMENTOS_TABLE } from "../constants/tables.js";

export const getMedicineColumnsQuery = `SHOW COLUMNS FROM ${MEDICAMENTOS_TABLE}`;
export const getMedicamentosQuery = `SELECT * FROM ${MEDICAMENTOS_TABLE} ORDER BY fecha DESC, nombreMedicamento ASC`;
