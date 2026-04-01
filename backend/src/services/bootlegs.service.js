import { db } from "../config/db.js";
import { env } from "../config/env.js";
import { getColumnLengthsQuery, insertBootlegQuery, insertTargetBootlegQuery, showTableLikeQuery } from "../queries/bootlegs.queries.js";
import { AppError } from "../utils/http.js";
import { isAllowedBootlegsTargetTable, parseBootlegsWorkbook, prepareBootlegImportValues } from "../utils/bootlegs.js";

export const previewBootlegImport = async (file) => {
  if (!file) {
    throw new AppError(400, "Debes seleccionar un archivo XLSX.");
  }

  const preview = parseBootlegsWorkbook(file.buffer);

  return {
    ...preview,
    previewRows: preview.rows.slice(0, 8),
    adjustedDatesCount: preview.dateAdjustments.length,
  };
};

export const importBootlegs = async ({ targetTable, rows }) => {
  if (!targetTable || !isAllowedBootlegsTargetTable(targetTable)) {
    throw new AppError(400, "La tabla destino no es valida. Usa un nombre como bootlegs_import_20260328.");
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new AppError(400, "No hay filas para importar.");
  }

  const [tableData] = await db.query(showTableLikeQuery, [targetTable]);

  if (!tableData.length) {
    throw new AppError(400, `La tabla ${targetTable} no existe.`);
  }

  const [columnData] = await db.query(getColumnLengthsQuery, [env.db.name, targetTable]);
  const columnLimits = (columnData || []).reduce((acc, column) => {
    acc[column.COLUMN_NAME] = column.CHARACTER_MAXIMUM_LENGTH || null;
    return acc;
  }, {});
  const { values, truncations } = prepareBootlegImportValues(rows, columnLimits);
  const [insertData] = await db.query(insertTargetBootlegQuery, [targetTable, values]);

  return {
    message: `Importacion completada en ${targetTable}.`,
    insertedRows: insertData.affectedRows,
    truncatedFields: truncations.length,
    truncationPreview: truncations.slice(0, 10),
  };
};

export const createBootleg = async (body) => {
  const values = [
    body.nombreBanda,
    body.lugar,
    body.fecha,
    body.tipo,
    body.cantidadDiscos,
    body.formato,
    body.version,
    body.almacenamiento,
    body.comentario,
    body.categoria,
    body.peso,
    body.negociable,
  ];

  const [result] = await db.query(insertBootlegQuery, [values]);
  return result;
};
