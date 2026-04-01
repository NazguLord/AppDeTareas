import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const requireAuth = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ message: "No autenticado." });
  }

  try {
    req.user = jwt.verify(token, env.jwtSecret);
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalido." });
  }
};
