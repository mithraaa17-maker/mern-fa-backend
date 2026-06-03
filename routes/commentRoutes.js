const express = require('express');
const commentController = require('../controllers/commentController');
const { authMiddleware } = require('../middleware/auth');
const { validateComment } = require('../validators/validators');

const router = express.Router();

router.post('/', authMiddleware, validateComment, commentController.createComment);
router.get('/:issue', authMiddleware, commentController.getComments);
router.get('/detail/:id', authMiddleware, commentController.getCommentById);
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
