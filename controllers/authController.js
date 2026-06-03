const authService = require('../services/authService');
const { asyncHandler } = require('../utils/errorHandler');

const authController = {
  register: asyncHandler(async (req, res) => {
    const { name, email, password, role, department } = req.body;
    const result = await authService.register(name, email, password, role, department);
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: result
    });
  }),

  login: asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: result
    });
  }),

  getMe: asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.userId);
    res.status(200).json({
      status: 'success',
      data: user
    });
  }),
};

module.exports = authController;
