const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { validateUserId } = require('../validators/validators');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware('admin'), userController.getAllUsers);
router.get('/:id', authMiddleware, validateUserId, userController.getUserById);

module.exports = router;
