const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const issueRoutes = require('./routes/issueRoutes');
const commentRoutes = require('./routes/commentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const syncRoutes = require('./routes/syncRoutes');
const errorHandler = require('./middleware/errorHandler');
const { AppError } = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/issues', issueRoutes);
app.use('/comments', commentRoutes);
app.use('/analytics', analyticsRoutes);
app.use('/sync', syncRoutes);

// 404 Handler
app.use((req, res) => {
  throw new AppError('Route not found', 404);
});

// Error Handler (must be last)
app.use(errorHandler);

module.exports = app;
