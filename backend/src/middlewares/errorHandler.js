import multer from "multer";

export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: "Ruta no encontrada." });
};

export const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    return res.status(400).json({ message: error.message });
  }

  const statusCode = error.statusCode || 500;
  const payload = { message: error.message || "Error interno del servidor." };

  if (error.details) {
    payload.details = error.details;
  }

  return res.status(statusCode).json(payload);
};
