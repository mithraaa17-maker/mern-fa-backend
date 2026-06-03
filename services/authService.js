const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { generateUserId } = require('../utils/generateId');
const { AppError } = require('../utils/errorHandler');

const authService = {
  async register(name, email, password, role = 'developer', department) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = generateUserId();

    const user = await User.create({
      userId,
      name,
      email,
      password: hashedPassword,
      role,
      department,
    });

    const token = generateToken(user._id);
    return { user: user.toObject(), token };
  },

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken(user._id);
    return { user: user.toObject(), token };
  },

  async getMe(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  async getUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  async getAllUsers() {
    return await User.find({});
  },
};

module.exports = authService;
