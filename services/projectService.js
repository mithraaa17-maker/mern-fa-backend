const Project = require('../models/Project');
const { generateProjectId } = require('../utils/generateId');
const { AppError } = require('../utils/errorHandler');

const projectService = {
  async createProject(title, description, owner, members = []) {
    const projectId = generateProjectId();
    const project = await Project.create({
      projectId,
      title,
      description,
      owner,
      members,
    });
    return await project.populate(['owner', 'members']);
  },

  async getProjects(filters = {}, page = 1, limit = 10, search = '') {
    const query = {};
    
    if (filters.status) query.status = filters.status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const projects = await Project.find(query)
      .populate(['owner', 'members'])
      .skip(skip)
      .limit(limit);
    
    const total = await Project.countDocuments(query);
    return {
      projects,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    };
  },

  async getProjectById(projectId) {
    const project = await Project.findById(projectId).populate(['owner', 'members']);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return project;
  },

  async updateProject(projectId, updateData) {
    const project = await Project.findByIdAndUpdate(projectId, updateData, { new: true })
      .populate(['owner', 'members']);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return project;
  },

  async deleteProject(projectId) {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return project;
  },

  async addMemberToProject(projectId, memberId) {
    const project = await Project.findByIdAndUpdate(
      projectId,
      { $addToSet: { members: memberId } },
      { new: true }
    ).populate(['owner', 'members']);
    
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return project;
  },
};

module.exports = projectService;
