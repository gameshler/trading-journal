import compression from "compression";
import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { CLIENT_URL, NODE_ENV } from "../constants/env";
import cookieParser from "cookie-parser";
import errorHandler from "../shared/middleware/errorHandler";
import path from "path";
import cors from "cors";
import routes from "../routes";

const app = express();

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/v1", routes);

app.use(errorHandler);

if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend", "dist", "index.html"));
  });
}

export default app;
