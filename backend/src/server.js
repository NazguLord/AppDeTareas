import app from "./app.js";
import { env } from "./config/env.js";
import { db } from "./config/db.js";

const startServer = async () => {
  try {
    const connection = await db.getConnection();
    connection.release();

    app.listen(env.port, () => {
      console.log(`Conectado al backend en el puerto ${env.port}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar el backend:", error.message);
    process.exit(1);
  }
};

startServer();
