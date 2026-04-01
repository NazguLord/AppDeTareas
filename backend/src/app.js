import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
