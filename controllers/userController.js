const User = require('../models/User');
const { asyncHandler } = require('../utils/errorHandler');

const userController = {
  getAllUsers: asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.status(200).json({
      status: 'success',
      data: users
    });
  }),

  getUserById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    res.status(200).json({
      status: 'success',
      data: user
    });
  }),
};

module.exports = userController;
