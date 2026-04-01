import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { AppError } from "../utils/http.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..", "..");
const frontendRoot = path.resolve(backendRoot, "..", "client", "src");
const uploadsDir = path.join(frontendRoot, "uploads");
const imagesDir = path.join(frontendRoot, "img");

const ensureDir = (targetPath) => {
  fs.mkdirSync(targetPath, { recursive: true });
};

ensureDir(uploadsDir);
ensureDir(imagesDir);

const buildDiskStorage = (destination) =>
  multer.diskStorage({
    destination(req, file, cb) {
      cb(null, destination);
    },
    filename(req, file, cb) {
      const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
      cb(null, `${Date.now()}${safeName}`);
    },
  });

const imageFileFilter = (req, file, cb) => {
  if (file.mimetype?.startsWith("image/")) {
    return cb(null, true);
  }

  return cb(new AppError(400, "Solo se permiten imagenes."));
};

const xlsxFileFilter = (req, file, cb) => {
  const isXlsxMime =
    file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    file.mimetype === "application/vnd.ms-excel";
  const isXlsxName = /\.xlsx?$/i.test(file.originalname || "");

  if (isXlsxMime || isXlsxName) {
    return cb(null, true);
  }

  return cb(new AppError(400, "Solo se permiten archivos XLSX."));
};

export const uploadGeneralFile = multer({
  storage: buildDiskStorage(uploadsDir),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadMedicineImage = multer({
  storage: buildDiskStorage(imagesDir),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadWorkbook = multer({
  storage: multer.memoryStorage(),
  fileFilter: xlsxFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});
