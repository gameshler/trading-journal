import { createLogger, format, transports } from "winston";
import "winston-daily-rotate-file";
import path from "path";
import { NODE_ENV } from "../../constants/env";

const logFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
  })
);

export const logger = createLogger({
  level: NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), logFormat),
    }),
    new transports.DailyRotateFile({
      dirname: path.resolve("logs"),
      filename: "%DATE%-app.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      zippedArchive: true,
    }),
  ],
  exitOnError: false,
});
