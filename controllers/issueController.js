const issueService = require('../services/issueService');
const { asyncHandler } = require('../utils/errorHandler');

const issueController = {
  createIssue: asyncHandler(async (req, res) => {
    const { title, description, priority, severity, project, dueDate } = req.body;
    const issue = await issueService.createIssue(
      title,
      description,
      priority,
      severity,
      project,
      req.userId,
      dueDate
    );
    res.status(201).json({
      status: 'success',
      message: 'Issue created successfully',
      data: issue
    });
  }),

  getIssues: asyncHandler(async (req, res) => {
    const { status, priority, severity, project, assignedTo, page = 1, limit = 10, search = '' } = req.query;
    const result = await issueService.getIssues(
      { status, priority, severity, project, assignedTo },
      parseInt(page),
      parseInt(limit),
      search
    );
    res.status(200).json({
      status: 'success',
      data: result
    });
  }),

  getIssueById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const issue = await issueService.getIssueById(id);
    res.status(200).json({
      status: 'success',
      data: issue
    });
  }),

  updateIssue: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const issue = await issueService.updateIssue(id, req.body);
    res.status(200).json({
      status: 'success',
      message: 'Issue updated successfully',
      data: issue
    });
  }),

  deleteIssue: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await issueService.deleteIssue(id);
    res.status(200).json({
      status: 'success',
      message: 'Issue deleted successfully'
    });
  }),

  assignIssue: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { assignedTo } = req.body;
    const issue = await issueService.assignIssue(id, assignedTo, req.userId);
    res.status(200).json({
      status: 'success',
      message: 'Issue assigned successfully',
      data: issue
    });
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const issue = await issueService.updateIssueStatus(id, status, req.userId, req.user.role);
    res.status(200).json({
      status: 'success',
      message: 'Issue status updated successfully',
      data: issue
    });
  }),
};

module.exports = issueController;
