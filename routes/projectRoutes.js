const express = require('express');
const projectController = require('../controllers/projectController');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { validateProject, validateProjectId } = require('../validators/validators');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('admin', 'manager'), validateProject, projectController.createProject);
router.get('/', authMiddleware, projectController.getProjects);
router.get('/:id', authMiddleware, validateProjectId, projectController.getProjectById);
router.patch('/:id', authMiddleware, roleMiddleware('admin', 'manager'), validateProjectId, projectController.updateProject);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), validateProjectId, projectController.deleteProject);
router.post('/:id/members', authMiddleware, roleMiddleware('admin', 'manager'), validateProjectId, projectController.addMember);

module.exports = router;
