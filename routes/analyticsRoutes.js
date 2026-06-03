const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/issues', authMiddleware, roleMiddleware('admin', 'manager'), analyticsController.getIssueAnalytics);
router.get('/projects', authMiddleware, roleMiddleware('admin', 'manager'), analyticsController.getProjectAnalytics);
router.get('/developers', authMiddleware, roleMiddleware('admin', 'manager'), analyticsController.getDeveloperAnalytics);

module.exports = router;
