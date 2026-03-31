import express from "express";
import mysql from "mysql2";
import cors from "cors";
import moment from "moment";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import multer from "multer";
import dotenv from "dotenv";
import XLSX from "xlsx";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 8800);
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
const JWT_SECRET = process.env.JWT_SECRET || "change-me";

const db = mysql.createConnection({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "sistemahogar",
  port: Number(process.env.DB_PORT || 3306),
});

app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/src/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
const uploadXlsx = multer({ storage: multer.memoryStorage() });

const storageB = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/src/img");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadB = multer({ storage: storageB });
const MEDICAMENTOS_TABLE = "medicamentos";
const AUDIO_BOOTLEGS_TABLE = "bootlegs_backup_20260328";
const AUDIO_FORMATS_TABLE = "catalogo_audio_formatos";
const AUDIO_TYPES_TABLE = "catalogo_audio_tipos";
const AUDIO_GENRES_TABLE = "catalogo_generos_bootlegs";

const mapCatalogRows = (rows = []) =>
  rows.map((row) => ({
    id: row.id,
    codigo: row.codigo,
    nombre: row.nombre,
    descripcion: row.descripcion,
  }));

const getMedicineColumns = (callback) => {
  db.query(`SHOW COLUMNS FROM ${MEDICAMENTOS_TABLE}`, (err, columns = []) => {
    if (err) return callback(err);
    return callback(null, columns);
  });
};

const getMedicineIdColumn = (callback) => {
  getMedicineColumns((err, columns = []) => {
    if (err) return callback(err);

    const prioritized = ["id", "idmedicamentos", "idMedicamentos", "id_medicamentos", "idmedicamento", "idMedicamento", "id_medicamento"];
    const priorityMatch = prioritized.find((candidate) => columns.some((column) => column.Field === candidate));
    const primaryMatch = columns.find((column) => column.Key === "PRI");
    const fallback = columns[0]?.Field;

    return callback(null, priorityMatch || primaryMatch?.Field || fallback || "id");
  });
};

const normalizeMedicineNumber = (value) => {
  if (value === "" || value === undefined || value === null) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const buildMedicinePayload = (body = {}, imagen = null, includeFecha = false) => ({
  nombreMedicamento: body.nombreMedicamento || "",
  descripcion: body.descripcion || "",
  cantidad: normalizeMedicineNumber(body.dosisCantidad ?? body.cantidad),
  unidadMedida: body.dosisUnidad || body.unidadMedida || "",
  cantidadPresentacion: normalizeMedicineNumber(body.cantidadPresentacion),
  unidadPresentacion: body.unidadPresentacion || "",
  dosisCantidad: normalizeMedicineNumber(body.dosisCantidad ?? body.cantidad),
  dosisUnidad: body.dosisUnidad || body.unidadMedida || "",
  imagen,
  ...(includeFecha ? { fecha: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss") } : {}),
});

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

const normalizeBootlegDate = (value) => {
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

const parseBootlegsWorkbook = (buffer) => {
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

const isAllowedBootlegsTargetTable = (tableName = "") => /^bootlegs(?:_[A-Za-z0-9]+)*$/.test(tableName);

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

const prepareBootlegImportValues = (rows = [], columnLimits = {}) => {
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
app.post("/upload", upload.single("file"), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.post("/medicamentos", uploadB.single("imagen"), function (req, res) {
  const imagen = req.file?.filename || null;

  getMedicineColumns((columnsErr, columns = []) => {
    if (columnsErr) return res.status(500).json(columnsErr);

    const payload = buildMedicinePayload(req.body, imagen, true);
    const availableEntries = Object.entries(payload).filter(([field]) => columns.some((column) => column.Field === field));
    const q = `INSERT INTO ${MEDICAMENTOS_TABLE} (${availableEntries.map(([field]) => `\`${field}\``).join(", ")}) VALUES (?)`;
    const values = availableEntries.map(([, value]) => value);

    db.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  });
});

app.get("/medicamentos", (req, res) => {
  const q = `SELECT * FROM ${MEDICAMENTOS_TABLE} ORDER BY fecha DESC, nombreMedicamento ASC`;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.put("/medicamentos/:id", uploadB.single("imagen"), (req, res) => {
  const medicamentoId = req.params.id;

  getMedicineColumns((columnsErr, columns = []) => {
    if (columnsErr) return res.status(500).json(columnsErr);

    getMedicineIdColumn((idErr, idColumn) => {
      if (idErr) return res.status(500).json(idErr);

      const imagen = req.file?.filename || req.body.imagenActual || null;
      const payload = buildMedicinePayload(req.body, imagen, false);
      const availableEntries = Object.entries(payload).filter(([field]) => columns.some((column) => column.Field === field));
      const q = `UPDATE ${MEDICAMENTOS_TABLE} SET ${availableEntries.map(([field]) => `\`${field}\` = ?`).join(", ")} WHERE \`${idColumn}\` = ?`;
      const values = availableEntries.map(([, value]) => value);

      db.query(q, [...values, medicamentoId], (err) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json({ message: "El medicamento se actualizo correctamente.", imagen });
      });
    });
  });
});

app.get("/", (req, res) => {
  res.json("Hola esta es el backend");
});

app.get("/contactos", (req, res) => {
  const q = "SELECT * FROM contactos";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/contactos", (req, res) => {
  const q = "INSERT INTO contactos (`name`, `number`, `email`, `image`) VALUES (?)";
  const values = [req.body.name, req.body.number, req.body.email, req.body.image];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.delete("/contactos/:id", (req, res) => {
  const contactoId = req.params.id;
  const q = "DELETE FROM contactos WHERE id = ?";

  db.query(q, [contactoId], (err, data) => {
    if (err) return res.json(err);
    return res.json("El contacto a sido eliminado correctamente.");
  });
});

app.put("/contactos/:id/edit", (req, res) => {
  const contactoId = req.params.id;
  const q = "UPDATE contactos SET `name` = ?, `number` = ?, `email` = ?, `image` = ? WHERE id = ?";
  const values = [req.body.name, req.body.number, req.body.email, req.body.image];

  db.query(q, [...values, contactoId], (err, data) => {
    if (err) return res.json(err);
    return res.json("El contacto se actualizo correctamente.");
  });
});

app.get("/tareas", (req, res) => {
  const q = "SELECT * FROM tareas ORDER BY id DESC LIMIT 5";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/registros", (req, res) => {
  const q = "SELECT id, tituloTarea, cantidad, DATE_FORMAT(fecha, '%Y-%m-%d %H:%i:%s') AS fecha FROM tareas ORDER BY fecha DESC";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/catalogos/audio-formatos", (req, res) => {
  const q = `SELECT id, codigo, nombre, descripcion FROM ${AUDIO_FORMATS_TABLE} WHERE activo = 1 ORDER BY orden, nombre`;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(mapCatalogRows(data));
  });
});

app.get("/catalogos/audio-tipos", (req, res) => {
  const q = `SELECT id, codigo, nombre, descripcion FROM ${AUDIO_TYPES_TABLE} WHERE activo = 1 ORDER BY orden, nombre`;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(mapCatalogRows(data));
  });
});

app.get("/catalogos/audio-generos", (req, res) => {
  const q = `SELECT id, codigo, nombre, descripcion FROM ${AUDIO_GENRES_TABLE} WHERE activo = 1 ORDER BY orden, nombre`;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(mapCatalogRows(data));
  });
});

app.get("/audios", (req, res) => {
  const q = `SELECT b.idbootlegs, b.nombreBanda, b.lugar, DATE_FORMAT(b.fecha, '%Y-%m-%d') AS fecha, b.tipo, b.genero_id, g.nombre AS genero, b.cantidadDiscos, b.formato, b.version, b.almacenamiento, b.comentario, b.categoria, b.peso, b.negociable FROM ${AUDIO_BOOTLEGS_TABLE} b LEFT JOIN ${AUDIO_GENRES_TABLE} g ON g.id = b.genero_id ORDER BY b.nombreBanda, b.fecha`;
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.put("/audios/:id", (req, res) => {
  const audioId = req.params.id;
  const normalizedDate = normalizeBootlegDate(req.body.fecha);
  const q = `UPDATE ${AUDIO_BOOTLEGS_TABLE} SET \`nombreBanda\` = ?, \`lugar\` = ?, \`fecha\` = ?, \`tipo\` = ?, \`genero_id\` = ?, \`cantidadDiscos\` = ?, \`formato\` = ?, \`version\` = ?, \`almacenamiento\` = ?, \`comentario\` = ?, \`categoria\` = ?, \`peso\` = ?, \`negociable\` = ? WHERE idbootlegs = ?`;
  const values = [
    req.body.nombreBanda || "",
    req.body.lugar || "",
    normalizedDate.value || null,
    req.body.tipo || "",
    req.body.genero_id === "" || req.body.genero_id === undefined || req.body.genero_id === null ? null : Number(req.body.genero_id),
    req.body.cantidadDiscos === "" || req.body.cantidadDiscos === undefined ? null : Number(req.body.cantidadDiscos),
    req.body.formato || "",
    req.body.version || null,
    req.body.almacenamiento || "",
    req.body.comentario || null,
    req.body.categoria || "",
    req.body.peso || "",
    req.body.negociable || "",
  ];

  db.query(q, [...values, audioId], (err) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json({ message: "El audio se actualizo correctamente." });
  });
});

app.post("/bootlegs/import/preview", uploadXlsx.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Debes seleccionar un archivo XLSX." });
    }

    const preview = parseBootlegsWorkbook(req.file.buffer);

    return res.status(200).json({
      ...preview,
      previewRows: preview.rows.slice(0, 8),
      adjustedDatesCount: preview.dateAdjustments.length,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message || "No se pudo leer el archivo XLSX." });
  }
});

app.post("/bootlegs/import", (req, res) => {
  const { targetTable, rows } = req.body;

  if (!targetTable || !isAllowedBootlegsTargetTable(targetTable)) {
    return res.status(400).json({ message: "La tabla destino no es valida. Usa un nombre como bootlegs_import_20260328." });
  }

  if (!Array.isArray(rows) || rows.length === 0) {
    return res.status(400).json({ message: "No hay filas para importar." });
  }

  const insertQuery =
    "INSERT INTO ?? (`nombreBanda`, `lugar`, `fecha`, `tipo`, `cantidadDiscos`, `formato`, `version`, `almacenamiento`, `comentario`, `categoria`, `peso`, `negociable`) VALUES ?";

  db.query("SHOW TABLES LIKE ?", [targetTable], (tableErr, tableData) => {
    if (tableErr) return res.status(500).json(tableErr);
    if (!tableData.length) {
      return res.status(400).json({ message: `La tabla ${targetTable} no existe.` });
    }

    const columnQuery = `
      SELECT COLUMN_NAME, CHARACTER_MAXIMUM_LENGTH
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = ?
        AND TABLE_NAME = ?
        AND COLUMN_NAME IN ('nombreBanda', 'lugar', 'tipo', 'formato', 'version', 'almacenamiento', 'comentario', 'categoria', 'peso', 'negociable')
    `;

    db.query(columnQuery, [process.env.DB_NAME || "sistemahogar", targetTable], (columnErr, columnData) => {
      if (columnErr) return res.status(500).json(columnErr);

      const columnLimits = (columnData || []).reduce((acc, column) => {
        acc[column.COLUMN_NAME] = column.CHARACTER_MAXIMUM_LENGTH || null;
        return acc;
      }, {});

      const { values, truncations } = prepareBootlegImportValues(rows, columnLimits);

      db.query(insertQuery, [targetTable, values], (insertErr, insertData) => {
        if (insertErr) return res.status(500).json(insertErr);
        return res.status(200).json({
          message: `Importacion completada en ${targetTable}.`,
          insertedRows: insertData.affectedRows,
          truncatedFields: truncations.length,
          truncationPreview: truncations.slice(0, 10),
        });
      });
    });
  });
});

app.get("/total", (req, res) => {
  const q = "SELECT SUM(cantidad) AS Total FROM tareas";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/tareas", (req, res) => {
  const fecha = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
  const q = "INSERT INTO tareas (`tituloTarea`, `cantidad`, `fecha`) VALUES (?)";
  const values = [req.body.tituloTarea, req.body.cantidad, fecha];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.post("/form", (req, res) => {
  const q = "INSERT INTO bootlegs (`nombreBanda`, `lugar`, `fecha`, `tipo`, `cantidadDiscos`, `formato`, `version`, `almacenamiento`, `comentario`, `categoria`, `peso`, `negociable`) VALUES (?)";
  const values = [
    req.body.nombreBanda,
    req.body.lugar,
    req.body.fecha,
    req.body.tipo,
    req.body.cantidadDiscos,
    req.body.formato,
    req.body.version,
    req.body.almacenamiento,
    req.body.comentario,
    req.body.categoria,
    req.body.peso,
    req.body.negociable,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.delete("/tareas/:id", (req, res) => {
  const tareaId = req.params.id;
  const q = "DELETE FROM tareas WHERE id = ?";

  db.query(q, [tareaId], (err, data) => {
    if (err) return res.json(err);
    return res.json("La tarea se ha eliminado satisfactoriamente.");
  });
});

app.put("/tareas/:id", (req, res) => {
  const tareaId = req.params.id;
  const q = "UPDATE tareas SET `tituloTarea` = ?, `cantidad` = ? WHERE id = ?";
  const values = [req.body.tituloTarea, req.body.cantidad];

  db.query(q, [...values, tareaId], (err, data) => {
    if (err) return res.json(err);
    return res.json("La tarea se ha actualizado satisfactoriamente.");
  });
});

app.post("/register", (req, res) => {
  const q = "SELECT * FROM users WHERE email = ? OR username = ?";

  db.query(q, [req.body.email, req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("Ya existe el usuario");

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const insertQuery = "INSERT INTO users(`username`, `email`, `password`) VALUES (?)";
    const values = [req.body.username, req.body.email, hash];

    db.query(insertQuery, [values], (insertErr) => {
      if (insertErr) return res.status(500).json(insertErr);
      return res.status(200).json("Usuario creado.");
    });
  });
});

app.post("/login", (req, res) => {
  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("Usuario no encontrado!");

    const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password);
    if (!isPasswordCorrect) return res.status(400).json("Usuario o password equivocado!");

    const token = jwt.sign({ id: data[0].id }, JWT_SECRET);
    const { password, ...other } = data[0];

    res
      .cookie("access_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
      })
      .status(200)
      .json(other);
  });
});

app.post("/logout", (req, res) => {
  res
    .clearCookie("access_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    })
    .status(200)
    .json("Usuario a sido deslogeado");
});

app.listen(PORT, () => {
  console.log(`Conectado al backend en el puerto ${PORT}`);
});

















