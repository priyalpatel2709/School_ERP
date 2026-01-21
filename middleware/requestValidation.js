const { validationResult, body } = require('express-validator');
const { logger } = require('../helper/logger');

// Common validation rules
const commonValidations = {
  id: body('id').isMongoId().withMessage('Invalid ID format'),
  email: body('email').isEmail().withMessage('Invalid email format'),
  password: body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
  name: body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  phone: body('phone')
    .matches(/^\+?[1-9]\d{1,14}$/)
    .withMessage('Invalid phone number format'),
  date: body('date').isISO8601().withMessage('Invalid date format'),
  number: body('number').isNumeric().withMessage('Must be a number'),
  boolean: body('boolean').isBoolean().withMessage('Must be a boolean value'),
};

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', {
      path: req.path,
      method: req.method,
      errors: errors.array()
    });
    
    return res.status(400).json({
      status: 'error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  
  next();
};

// Sanitization middleware
const sanitizeRequest = (req, res, next) => {
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  // Sanitize body parameters
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  next();
};

module.exports = {
  commonValidations,
  validateRequest,
  sanitizeRequest
}; 