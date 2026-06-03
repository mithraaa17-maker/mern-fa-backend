const express = require('express');
const syncController = require('../controllers/syncController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin'), syncController.syncDataset);

module.exports = router;
