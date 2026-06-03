const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../validators/validators');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
