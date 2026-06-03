const Issue = require('../models/Issue');
const ActivityLog = require('../models/ActivityLog');
const { generateIssueId } = require('../utils/generateId');
const { AppError } = require('../utils/errorHandler');

const issueService = {
  async createIssue(title, description, priority, severity, project, reportedBy, dueDate) {
    const issueId = generateIssueId();
    const issue = await Issue.create({
      issueId,
      title,
      description,
      priority,
      severity,
      project,
      reportedBy,
      dueDate,
    });
    return await issue.populate(['project', 'assignedTo', 'reportedBy']);
  },

  async getIssues(filters = {}, page = 1, limit = 10, search = '') {
    const query = {};
    
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;
    if (filters.severity) query.severity = filters.severity;
    if (filters.project) query.project = filters.project;
    if (filters.assignedTo) query.assignedTo = filters.assignedTo;
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const issues = await Issue.find(query)
      .populate(['project', 'assignedTo', 'reportedBy'])
      .skip(skip)
      .limit(limit);
    
    const total = await Issue.countDocuments(query);
    return {
      issues,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  },

  async getIssueById(issueId) {
    const issue = await Issue.findById(issueId).populate(['project', 'assignedTo', 'reportedBy']);
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }
    return issue;
  },

  async updateIssue(issueId, updateData) {
    const issue = await Issue.findByIdAndUpdate(issueId, updateData, { new: true })
      .populate(['project', 'assignedTo', 'reportedBy']);
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }
    return issue;
  },

  async deleteIssue(issueId) {
    const issue = await Issue.findByIdAndDelete(issueId);
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }
    return issue;
  },

  async assignIssue(issueId, assignedTo, userId) {
    const issue = await Issue.findById(issueId);
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    if (issue.status === 'closed') {
      throw new AppError('Cannot assign a closed issue', 400);
    }

    const previousAssignee = issue.assignedTo;
    issue.assignedTo = assignedTo;
    await issue.save();

    // Log activity
    await ActivityLog.create({
      issue: issueId,
      user: userId,
      action: 'assigned',
    });

    return await issue.populate(['project', 'assignedTo', 'reportedBy']);
  },

  async updateIssueStatus(issueId, newStatus, userId, userRole) {
    const issue = await Issue.findById(issueId);
    if (!issue) {
      throw new AppError('Issue not found', 404);
    }

    // Workflow validation
    const validTransitions = {
      'open': ['in-progress', 'closed'],
      'in-progress': ['testing', 'open', 'closed'],
      'testing': ['resolved', 'in-progress', 'closed'],
      'resolved': ['closed'],
      'closed': []
    };

    if (!validTransitions[issue.status]?.includes(newStatus)) {
      throw new AppError(`Cannot transition from ${issue.status} to ${newStatus}`, 400);
    }

    // Rule: Tester cannot close issues
    if (newStatus === 'closed' && userRole === 'tester') {
      throw new AppError('Tester cannot close issues', 403);
    }

    // Rule: Only assigned developer can move issue to testing
    if (newStatus === 'testing' && issue.assignedTo?.toString() !== userId.toString()) {
      throw new AppError('Only assigned developer can move issue to testing', 403);
    }

    // Rule: Closed issues cannot move back
    if (issue.status === 'closed') {
      throw new AppError('Closed issues cannot be modified', 400);
    }

    const previousStatus = issue.status;
    issue.status = newStatus;
    await issue.save();

    // Log activity
    await ActivityLog.create({
      issue: issueId,
      user: userId,
      action: 'status_changed',
      previousStatus,
      newStatus,
    });

    return await issue.populate(['project', 'assignedTo', 'reportedBy']);
  },
};

module.exports = issueService;
