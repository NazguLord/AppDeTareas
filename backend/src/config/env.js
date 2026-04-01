import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "..", "..");
const envPath = path.join(backendRoot, ".env");

dotenv.config({ path: envPath });

const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length) {
  console.warn(`[env] Faltan variables obligatorias: ${missingEnvVars.join(", ")}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 8800),
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET || "change-me",
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "sistemahogar",
    port: Number(process.env.DB_PORT || 3306),
  },
  cookie: {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};
