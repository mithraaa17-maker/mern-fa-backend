const Issue = require('../models/Issue');
const Project = require('../models/Project');
const User = require('../models/User');

const analyticsService = {
  async getIssueAnalytics() {
    const [totalIssues] = await Issue.aggregate([
      { $count: 'count' }
    ]);

    const [issuesByStatus] = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: null,
          statuses: { $push: { status: '$_id', count: '$count' } }
        }
      }
    ]);

    const statusMap = {};
    issuesByStatus?.statuses?.forEach(item => {
      statusMap[item.status] = item.count;
    });

    return {
      totalIssues: totalIssues?.count || 0,
      openIssues: statusMap['open'] || 0,
      inProgressIssues: statusMap['in-progress'] || 0,
      testingIssues: statusMap['testing'] || 0,
      resolvedIssues: statusMap['resolved'] || 0,
      closedIssues: statusMap['closed'] || 0,
    };
  },

  async getProjectAnalytics() {
    const [activeProjects] = await Project.aggregate([
      { $match: { status: 'active' } },
      { $count: 'count' }
    ]);

    const [closedProjects] = await Project.aggregate([
      { $match: { status: 'closed' } },
      { $count: 'count' }
    ]);

    const projectWiseIssueCount = await Project.aggregate([
      {
        $lookup: {
          from: 'issues',
          localField: '_id',
          foreignField: 'project',
          as: 'issues'
        }
      },
      {
        $project: {
          title: 1,
          issueCount: { $size: '$issues' }
        }
      }
    ]);

    return {
      projectWiseIssueCount,
      activeProjectCount: activeProjects?.count || 0,
      closedProjectCount: closedProjects?.count || 0,
    };
  },

  async getDeveloperAnalytics() {
    const developerWiseResolved = await User.aggregate([
      { $match: { role: 'developer' } },
      {
        $lookup: {
          from: 'issues',
          localField: '_id',
          foreignField: 'assignedTo',
          as: 'assignedIssues'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          resolvedCount: {
            $size: {
              $filter: {
                input: '$assignedIssues',
                as: 'issue',
                cond: { $eq: ['$$issue.status', 'resolved'] }
              }
            }
          }
        }
      },
      { $sort: { resolvedCount: -1 } }
    ]);

    const [avgResolutionData] = await Issue.aggregate([
      {
        $match: {
          status: { $in: ['resolved', 'closed'] },
          createdAt: { $exists: true },
          updatedAt: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: {
            $avg: {
              $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 86400000]
            }
          }
        }
      }
    ]);

    const highestResolvedCount = developerWiseResolved[0]?.resolvedCount || 0;
    const avgResolutionTime = avgResolutionData?.avgTime ? `${avgResolutionData.avgTime.toFixed(1)} days` : 'N/A';

    return {
      developerWiseResolved,
      averageResolutionTime: avgResolutionTime,
      highestResolvedCount,
    };
  },
};

module.exports = analyticsService;
