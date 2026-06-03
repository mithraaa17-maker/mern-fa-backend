const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');
const { AppError, asyncHandler } = require('../utils/errorHandler');

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('No token provided', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new AppError('Invalid or expired token', 401);
  }

  const user = await User.findById(decoded.userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  req.user = user;
  req.userId = user._id;
  next();
});

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('No user found', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Access denied', 403);
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware,
};
