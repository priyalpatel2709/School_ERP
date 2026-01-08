const { connectToDatabase } = require('../config/db');
const { logger } = require('../helper/logger');

const healthCheck = async (req, res) => {
  const startTime = Date.now();
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    responseTime: null,
    database: {
      status: 'unhealthy',
      connectionState: null,
      error: null
    },
    system: {
      uptime: null,
      memory: null,
      cpu: null,
      environment: process.env.NODE_ENV || 'development'
    },
    services: {
      database: false,
      cache: false,
      storage: false
    }
  };

  try {
    // Check database connectivity
    const db = await connectToDatabase(req.user?.schoolID || 'default');
    healthStatus.database.status = db.readyState === 1 ? 'healthy' : 'unhealthy';
    healthStatus.database.connectionState = db.readyState;
    healthStatus.services.database = db.readyState === 1;

    // Check system resources
    const memoryUsage = process.memoryUsage();
    healthStatus.system.memory = {
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`,
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`
    };

    // Get system uptime
    healthStatus.system.uptime = `${Math.floor(process.uptime())} seconds`;

    // Calculate response time
    healthStatus.responseTime = `${Date.now() - startTime}ms`;

    // Determine overall health status
    const isHealthy = healthStatus.services.database && 
                     healthStatus.database.status === 'healthy';

    healthStatus.status = isHealthy ? 'healthy' : 'degraded';

    // Log health check results
    logger.info('Health check completed', healthStatus);

    // Return appropriate status code based on health
    res.status(isHealthy ? 200 : 503).json(healthStatus);

  } catch (error) {
    // Log error and return unhealthy status
    logger.error('Health check failed', { error: error.message });
    
    healthStatus.status = 'unhealthy';
    healthStatus.database.error = error.message;
    healthStatus.responseTime = `${Date.now() - startTime}ms`;

    res.status(503).json(healthStatus);
  }
};

module.exports = healthCheck; 