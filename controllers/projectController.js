const projectService = require('../services/projectService');
const { asyncHandler, AppError } = require('../utils/errorHandler');

const projectController = {
  createProject: asyncHandler(async (req, res) => {
    const { title, description, members } = req.body;
    const project = await projectService.createProject(
      title,
      description,
      req.userId,
      members || []
    );
    res.status(201).json({
      status: 'success',
      message: 'Project created successfully',
      data: project
    });
  }),

  getProjects: asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10, search = '' } = req.query;
    const result = await projectService.getProjects(
      { status },
      parseInt(page),
      parseInt(limit),
      search
    );
    res.status(200).json({
      status: 'success',
      data: result
    });
  }),

  getProjectById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);
    res.status(200).json({
      status: 'success',
      data: project
    });
  }),

  updateProject: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await projectService.updateProject(id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Project updated successfully',
      data: project
    });
  }),

  deleteProject: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await projectService.deleteProject(id);
    res.status(200).json({
      status: 'success',
      message: 'Project deleted successfully'
    });
  }),

  addMember: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { memberId } = req.body;
    const project = await projectService.addMemberToProject(id, memberId);
    res.status(200).json({
      status: 'success',
      message: 'Member added successfully',
      data: project
    });
  }),
};

module.exports = projectController;
