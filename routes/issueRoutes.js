const express = require('express');
const issueController = require('../controllers/issueController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { validateIssue, validateIssueId } = require('../validators/validators');

const router = express.Router();

router.post('/', authMiddleware, validateIssue, issueController.createIssue);
router.get('/', authMiddleware, issueController.getIssues);
router.get('/:id', authMiddleware, validateIssueId, issueController.getIssueById);
router.patch('/:id', authMiddleware, validateIssueId, issueController.updateIssue);
router.delete('/:id', authMiddleware, validateIssueId, issueController.deleteIssue);
router.patch('/:id/assign', authMiddleware, roleMiddleware('admin', 'manager'), validateIssueId, issueController.assignIssue);
router.patch('/:id/status', authMiddleware, validateIssueId, issueController.updateStatus);

module.exports = router;
