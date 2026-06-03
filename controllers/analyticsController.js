const analyticsService = require('../services/analyticsService');
const { asyncHandler } = require('../utils/errorHandler');

const analyticsController = {
  getIssueAnalytics: asyncHandler(async (req, res) => {
    const analytics = await analyticsService.getIssueAnalytics();
    res.status(200).json({
      status: 'success',
      data: analytics
    });
  }),

  getProjectAnalytics: asyncHandler(async (req, res) => {
    const analytics = await analyticsService.getProjectAnalytics();
    res.status(200).json({
      status: 'success',
      data: analytics
    });
  }),

  getDeveloperAnalytics: asyncHandler(async (req, res) => {
    const analytics = await analyticsService.getDeveloperAnalytics();
    res.status(200).json({
      status: 'success',
      data: analytics
    });
  }),
};

module.exports = analyticsController;
