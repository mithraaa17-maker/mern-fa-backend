const commentService = require('../services/commentService');
const { asyncHandler } = require('../utils/errorHandler');

const commentController = {
  createComment: asyncHandler(async (req, res) => {
    const { issue, message } = req.body;
    const comment = await commentService.createComment(issue, req.userId, message);
    res.status(201).json({
      status: 'success',
      message: 'Comment created successfully',
      data: comment
    });
  }),

  getComments: asyncHandler(async (req, res) => {
    const { issue } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const result = await commentService.getComments(issue, parseInt(page), parseInt(limit));
    res.status(200).json({
      status: 'success',
      data: result
    });
  }),

  getCommentById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const comment = await commentService.getCommentById(id);
    res.status(200).json({
      status: 'success',
      data: comment
    });
  }),

  deleteComment: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await commentService.deleteComment(id);
    res.status(200).json({
      status: 'success',
      message: 'Comment deleted successfully'
    });
  }),
};

module.exports = commentController;
