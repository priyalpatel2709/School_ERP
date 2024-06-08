const connectToDatabase = require('../config/db');

const identifyTenant = async (req, res, next) => {
    const schoolId = req.header('X-School-Id'); // or any other way you determine the tenant
    if (!schoolId) {
      return res.status(400).json({ message: 'School ID is required' });
    }
  
    req.db = await connectToDatabase(schoolId);
    next();
  };
  
  module.exports = identifyTenant;