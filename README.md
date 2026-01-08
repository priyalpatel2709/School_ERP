# School ERP System - Enterprise Edition

## Overview
This is a robust, enterprise-grade backend for the School ERP System, built with Node.js, Express, and MongoDB.

## Enterprise Features Implemented
- **Security**:
  - `Helmet` for secure HTTP headers.
  - `HPP` (HTTP Parameter Pollution) protection.
  - `Rate Limiting` to prevent abuse.
  - `CORS` configuration.
  - Strict input validation and sanitization.
- **Performance**:
  - `Compression` (Gzip) for response optimization.
  - **Clustering** via PM2 to utilize all CPU cores.
  - Connection pooling for MongoDB.
- **Observability**:
  - Structured logging with `Winston` (Console + File rotation).
  - HTTP Request logging.
- **Documentation**:
  - Swagger/OpenAPI documentation available at `/api-docs`.
- **Infrastructure**:
  - Docker-ready (via Environment variables).
  - PM2 Process Management configuration.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB
- PM2 (`npm install -g pm2`)

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file based on `.env.example` (if available) or ensure the following are set:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/school_{schoolId}
NODE_ENV=development
```

### Running the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode (PM2 Cluster):**
```bash
npm run start:prod
```
This will start the application in `cluster` mode, utilizing all available CPU cores, with log rotation enabled.

To stop the production server:
```bash
npm run stop:prod
```

### API Documentation
Once the server is running, visit:
[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Project Structure
- `config/`: Database and tool configurations.
- `controllers/`: Business logic.
- `middleware/`: Security, validation, and error handling.
- `models/`: Mongoose schemas (Tenant-aware).
- `routes/`: API route definitions.
- `helper/`: Utility functions and logger.