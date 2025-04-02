const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Add colors to winston
winston.addColors(colors);

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  levels,
  format: logFormat,
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    // Write all logs error (and above) to error.log
    // new DailyRotateFile({
    //   filename: path.join(__dirname, "../logs/error-%DATE%.log"),
    //   datePattern: "YYYY-MM-DD",
    //   zippedArchive: true,
    //   maxSize: "20m",
    //   maxFiles: "14d",
    //   level: "error",
    // }),
    // // Write all logs to combined.log
    // new DailyRotateFile({
    //   filename: path.join(__dirname, "../logs/combined-%DATE%.log"),
    //   datePattern: "YYYY-MM-DD",
    //   zippedArchive: true,
    //   maxSize: "20m",
    //   maxFiles: "14d",
    // }),
  ],
});

// Create a stream object for Morgan integration
const stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  });

  res.on("error", (err) => {
    logger.error("Request error", {
      error: err.message,
      stack: err.stack,
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    });
  });

  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error("Error occurred", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  next(err);
};

module.exports = {
  logger,
  stream,
  requestLogger,
  errorLogger,
};
