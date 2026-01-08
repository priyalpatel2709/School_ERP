const mongoose = require("mongoose");
const colors = require("colors");
const { logger } = require("../helper/logger");

const connections = {};
const POOL_SIZE = 10; // Maximum number of connections in the pool
const SERVER_SELECTION_TIMEOUT = 5000; // Timeout in milliseconds
const SOCKET_TIMEOUT = 45000; // Socket timeout in milliseconds
const CONNECT_TIMEOUT = 10000; // Connection timeout in milliseconds

const getDatabaseUri = (schoolId) => {
  const template = process.env.MONGO_URI;
  return template.replace("{schoolId}", schoolId);
};
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     //   useCreateIndex: true,
//     });

//     console.log(`MongoDB Connected:`.underline.bgGreen);
//   } catch (error) {
//     logger.error(`Error Connect To MongoDb: ${error.message}`);
//     process.exit();
//   }
// };

const connectToDatabase = async (schoolId) => {
  try {
    // Return existing connection if available
    if (connections[schoolId]) {
      const connection = connections[schoolId];
      // Check if connection is still alive
      if (connection.readyState === 1) {
        return connection;
      }
      // If connection is dead, remove it and create new one
      delete connections[schoolId];
    }

    const uri = `mongodb://localhost:27017/school_${schoolId}`;
    
    // Create connection with optimized pooling settings
    const connection = mongoose.createConnection(uri, {
      maxPoolSize: POOL_SIZE,
      minPoolSize: 2,
      serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT,
      socketTimeoutMS: SOCKET_TIMEOUT,
      connectTimeoutMS: CONNECT_TIMEOUT,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: 'majority',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
      maxIdleTimeMS: 60000, // Close idle connections after 1 minute
    });

    // Connection event handlers
    connection.on('connected', () => {
      logger.info(`Connected to MongoDB for school ${schoolId}`);
    });

    connection.on('error', (err) => {
      logger.error(`MongoDB connection error for school ${schoolId}: ${err.message}`);
    });

    connection.on('disconnected', () => {
      logger.warn(`Disconnected from MongoDB for school ${schoolId}`);
    });

    // Store connection in pool
    connections[schoolId] = connection;

    // Wait for connection to be established
    await new Promise((resolve, reject) => {
      connection.once('open', resolve);
      connection.once('error', reject);
    });

    return connection;
  } catch (error) {
    logger.error(`Failed to connect to MongoDB for school ${schoolId}: ${error.message}`);
    throw error;
  }
};

// Function to close all connections
const closeAllConnections = async () => {
  try {
    for (const [schoolId, connection] of Object.entries(connections)) {
      await connection.close();
      logger.info(`Closed connection for school ${schoolId}`);
    }
    connections = {};
  } catch (error) {
    logger.error(`Error closing connections: ${error.message}`);
    throw error;
  }
};

// Graceful shutdown handler
process.on('SIGINT', async () => {
  await closeAllConnections();
  process.exit(0);
});

module.exports = {
  connectToDatabase,
  closeAllConnections
};
