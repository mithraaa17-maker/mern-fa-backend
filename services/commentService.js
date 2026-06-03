const Comment = require('../models/Comment');
const { generateCommentId } = require('../utils/generateId');
const { AppError } = require('../utils/errorHandler');

const commentService = {
  async createComment(issue, user, message) {
    const commentId = generateCommentId();
    const comment = await Comment.create({
      commentId,
      issue,
      user,
      message,
    });
    return await comment.populate(['issue', 'user']);
  },

  async getComments(issueId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const comments = await Comment.find({ issue: issueId })
      .populate(['issue', 'user'])
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await Comment.countDocuments({ issue: issueId });
    return {
      comments,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  },

  async getCommentById(commentId) {
    const comment = await Comment.findById(commentId).populate(['issue', 'user']);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }
    return comment;
  },

  async deleteComment(commentId) {
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      throw new AppError('Comment not found', 404);
    }
    return comment;
  },
};

module.exports = commentService;
