import moment from "moment";
import XLSX from "xlsx";

const BOOTLEG_IMPORT_FIELDS = [
  "nombreBanda",
  "lugar",
  "fecha",
  "tipo",
  "cantidadDiscos",
  "formato",
  "version",
  "almacenamiento",
  "comentario",
  "categoria",
  "peso",
  "negociable",
];

const BOOTLEG_IMPORT_REQUIRED_FIELDS = [
  "nombreBanda",
  "lugar",
  "fecha",
  "tipo",
  "cantidadDiscos",
  "formato",
  "almacenamiento",
  "categoria",
  "peso",
  "negociable",
];

const BOOTLEG_IMPORT_HEADER_MAP = {
  band: "nombreBanda",
  venuecitycountry: "lugar",
  dateyearmonthday: "fecha",
  source: "tipo",
  ncdr: "cantidadDiscos",
  formato: "formato",
  version: "version",
  almacenamiento: "almacenamiento",
  comentario: "comentario",
  categoria: "categoria",
  tradeable: "negociable",
  traedable: "negociable",
  peso: "peso",
};

const normalizeImportHeader = (header = "") =>
  header
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const parseImportValue = (value) => {
  if (value === undefined || value === null) return "";
  return typeof value === "string" ? value.trim() : value;
};

export const normalizeBootlegDate = (value) => {
  const rawValue = parseImportValue(value);

  if (!rawValue) {
    return { value: "", adjusted: false, original: "" };
  }

  const normalizedValue = rawValue.toString().replace(/[./]/g, "-").trim();
  const exactDate = moment(normalizedValue, ["YYYY-MM-DD", "YYYY-M-D"], true);

  if (exactDate.isValid()) {
    return {
      value: exactDate.format("YYYY-MM-DD"),
      adjusted: exactDate.format("YYYY-MM-DD") !== normalizedValue,
      original: rawValue,
    };
  }

  const partialMatch = normalizedValue.match(/^(\d{4})(?:-(\d{1,2}|00))?(?:-(\d{1,2}|00))?$/);

  if (!partialMatch) {
    return { value: "", adjusted: true, original: rawValue };
  }

  const year = Number(partialMatch[1]);
  const monthValue = partialMatch[2] ? Number(partialMatch[2]) : 1;
  const dayValue = partialMatch[3] ? Number(partialMatch[3]) : 1;
  const month = Math.min(Math.max(monthValue || 1, 1), 12);
  const monthSeed = `${year}-${String(month).padStart(2, "0")}-01`;
  const maxDay = moment(monthSeed, "YYYY-MM-DD", true).daysInMonth();
  const day = Math.min(Math.max(dayValue || 1, 1), maxDay);
  const safeDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return {
    value: safeDate,
    adjusted: safeDate !== normalizedValue,
    original: rawValue,
  };
};

export const parseBootlegsWorkbook = (buffer) => {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: false });
  const firstSheet = workbook.SheetNames[0];

  if (!firstSheet) {
    throw new Error("El archivo no contiene hojas para importar.");
  }

  const worksheet = workbook.Sheets[firstSheet];
  const rawRows = XLSX.utils.sheet_to_json(worksheet, { defval: "", raw: false });

  if (!rawRows.length) {
    throw new Error("El archivo no contiene filas para importar.");
  }

  const detectedFields = new Set();
  const dateAdjustments = [];
  const rows = rawRows
    .map((row, index) => {
      const mappedRow = BOOTLEG_IMPORT_FIELDS.reduce((acc, field) => ({ ...acc, [field]: "" }), {});

      Object.entries(row).forEach(([header, value]) => {
        const normalizedHeader = normalizeImportHeader(header);
        const targetField = BOOTLEG_IMPORT_HEADER_MAP[normalizedHeader];

        if (!targetField) return;

        detectedFields.add(targetField);
        mappedRow[targetField] = parseImportValue(value);
      });

      const normalizedDate = normalizeBootlegDate(mappedRow.fecha);
      mappedRow.fecha = normalizedDate.value;
      mappedRow.cantidadDiscos = mappedRow.cantidadDiscos ? Number(mappedRow.cantidadDiscos) : "";
      mappedRow.__rowNumber = index + 2;

      if (normalizedDate.adjusted) {
        dateAdjustments.push({
          rowNumber: mappedRow.__rowNumber,
          original: normalizedDate.original,
          normalized: normalizedDate.value,
        });
      }

      return mappedRow;
    })
    .filter((row) => BOOTLEG_IMPORT_FIELDS.some((field) => `${row[field] ?? ""}`.trim() !== ""));

  const missingFields = BOOTLEG_IMPORT_REQUIRED_FIELDS.filter((field) => !detectedFields.has(field));

  return {
    rows,
    sheetName: firstSheet,
    totalRows: rows.length,
    detectedFields: Array.from(detectedFields),
    missingFields,
    dateAdjustments,
  };
};

export const isAllowedBootlegsTargetTable = (tableName = "") => /^bootlegs(?:_[A-Za-z0-9]+)*$/.test(tableName);

const trimToColumnLimit = (value, maxLength, field, rowNumber, truncations) => {
  if (value === undefined || value === null || value === "" || !maxLength) {
    return value;
  }

  const stringValue = `${value}`;
  if (stringValue.length <= maxLength) {
    return value;
  }

  truncations.push({
    field,
    rowNumber,
    originalLength: stringValue.length,
    maxLength,
  });

  return stringValue.slice(0, maxLength);
};

export const prepareBootlegImportValues = (rows = [], columnLimits = {}) => {
  const truncations = [];

  const values = rows.map((row) => {
    const normalizedDate = normalizeBootlegDate(row.fecha);
    const rowNumber = row.__rowNumber || null;

    return [
      trimToColumnLimit(row.nombreBanda || "", columnLimits.nombreBanda, "nombreBanda", rowNumber, truncations),
      trimToColumnLimit(row.lugar || "", columnLimits.lugar, "lugar", rowNumber, truncations),
      normalizedDate.value || null,
      trimToColumnLimit(row.tipo || "", columnLimits.tipo, "tipo", rowNumber, truncations),
      row.cantidadDiscos === "" ? null : Number(row.cantidadDiscos),
      trimToColumnLimit(row.formato || "", columnLimits.formato, "formato", rowNumber, truncations),
      trimToColumnLimit(row.version || null, columnLimits.version, "version", rowNumber, truncations),
      trimToColumnLimit(row.almacenamiento || "", columnLimits.almacenamiento, "almacenamiento", rowNumber, truncations),
      trimToColumnLimit(row.comentario || null, columnLimits.comentario, "comentario", rowNumber, truncations),
      trimToColumnLimit(row.categoria || "", columnLimits.categoria, "categoria", rowNumber, truncations),
      trimToColumnLimit(row.peso || "", columnLimits.peso, "peso", rowNumber, truncations),
      trimToColumnLimit(row.negociable || "", columnLimits.negociable, "negociable", rowNumber, truncations),
    ];
  });

  return { values, truncations };
};
