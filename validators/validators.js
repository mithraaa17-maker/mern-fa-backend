const { body, validationResult, param, query } = require('express-validator');
const { AppError } = require('../utils/errorHandler');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    throw new AppError(JSON.stringify(formattedErrors), 400);
  }
  next();
};

const validateRegister = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['admin', 'manager', 'developer', 'tester']).withMessage('Invalid role'),
  handleValidationErrors,
];

const validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const validateProject = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('members').optional().isArray().withMessage('Members must be an array'),
  handleValidationErrors,
];

const validateIssue = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional(),
  body('priority').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  body('severity').isIn(['minor', 'major', 'critical']).withMessage('Invalid severity'),
  body('project').notEmpty().withMessage('Project is required'),
  handleValidationErrors,
];

const validateComment = [
  body('message').notEmpty().withMessage('Message is required'),
  body('issue').notEmpty().withMessage('Issue is required'),
  handleValidationErrors,
];

const validateIssueId = [
  param('id').notEmpty().withMessage('Issue ID is required'),
  handleValidationErrors,
];

const validateProjectId = [
  param('id').notEmpty().withMessage('Project ID is required'),
  handleValidationErrors,
];

const validateUserId = [
  param('id').notEmpty().withMessage('User ID is required'),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProject,
  validateIssue,
  validateComment,
  validateIssueId,
  validateProjectId,
  validateUserId,
  handleValidationErrors,
};
