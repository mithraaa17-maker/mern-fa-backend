const syncService = require('../services/syncService');
const { asyncHandler } = require('../utils/errorHandler');

const syncController = {
  syncDataset: asyncHandler(async (req, res) => {
    const result = await syncService.syncExternalDataset();
    const statusCode = result.success ? 200 : 207;
    res.status(statusCode).json({
      status: result.success ? 'success' : 'partial',
      data: result
    });
  }),

  getSyncStatus: asyncHandler(async (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Sync endpoint is available',
      data: {
        lastSync: null,
        nextScheduledSync: null
      }
    });
  }),
};

module.exports = syncController;
