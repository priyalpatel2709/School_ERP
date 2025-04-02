const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const helmet = require("helmet");

// Import middlewares
const { requestLogger, errorLogger } = require("./helper/logger");
const { limiter, securityHeaders } = require("./middleware/securityHeaders");
const { sanitizeRequest } = require("./middleware/requestValidation");
const healthCheck = require("./middleware/healthCheck");

// Import routes
const {
  userRouters,
  roleRoutes,
  schoolDetailRoutes,
  studentRoutes,
  classRoutes,
  homeWorkRoutes,
  teacherRoutes,
  subjectRoutes,
  timeTableRoutes,
  notificationRoutes
} = require("./routes");

// Import error handlers
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Load environment variables
dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Security middleware
app.use(helmet());
app.use(securityHeaders);
app.use(limiter);

// Logging middleware
app.use(morgan('combined', { stream: require('./helper/logger').stream }));
app.use(requestLogger);

// Request processing middleware
app.use(sanitizeRequest);

// Health check endpoint
app.get("/health", healthCheck);

// API routes
app.use("/api/v1/user", userRouters);
app.use("/api/v1/role", roleRoutes);
app.use("/api/v1/schoolInfo", schoolDetailRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/class", classRoutes);
app.use("/api/v1/homeWork", homeWorkRoutes);
app.use("/api/v1/teacher", teacherRoutes);
app.use("/api/v1/subject", subjectRoutes);
app.use("/api/v1/timeTable", timeTableRoutes);
app.use("/api/v1/notification", notificationRoutes);

// Error handling
app.use(notFound);
app.use(errorLogger);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on PORT http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});
