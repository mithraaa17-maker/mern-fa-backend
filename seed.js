// Seed script to initialize database with sample data
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Issue = require('../models/Issue');
const { generateUserId, generateProjectId, generateIssueId } = require('../utils/generateId');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Issue.deleteMany({});

    // Create sample users
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await User.insertMany([
      {
        userId: generateUserId(),
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        department: 'Management',
        status: 'active',
      },
      {
        userId: generateUserId(),
        name: 'Manager User',
        email: 'manager@example.com',
        password: hashedPassword,
        role: 'manager',
        department: 'Engineering',
        status: 'active',
      },
      {
        userId: generateUserId(),
        name: 'Developer User',
        email: 'developer@example.com',
        password: hashedPassword,
        role: 'developer',
        department: 'Engineering',
        status: 'active',
      },
      {
        userId: generateUserId(),
        name: 'Tester User',
        email: 'tester@example.com',
        password: hashedPassword,
        role: 'tester',
        department: 'QA',
        status: 'active',
      },
    ]);

    console.log('Created sample users');

    // Create sample projects
    const projects = await Project.insertMany([
      {
        projectId: generateProjectId(),
        title: 'Web Application',
        description: 'Main web application project',
        owner: users[0]._id,
        members: [users[2]._id],
        status: 'active',
      },
      {
        projectId: generateProjectId(),
        title: 'Mobile App',
        description: 'Mobile application project',
        owner: users[1]._id,
        members: [users[2]._id, users[3]._id],
        status: 'active',
      },
    ]);

    console.log('Created sample projects');

    // Create sample issues
    await Issue.insertMany([
      {
        issueId: generateIssueId(),
        title: 'Login page broken',
        description: 'Login functionality is not working properly',
        priority: 'high',
        severity: 'critical',
        status: 'open',
        project: projects[0]._id,
        reportedBy: users[3]._id,
      },
      {
        issueId: generateIssueId(),
        title: 'Fix database connection',
        description: 'Database connection timing out',
        priority: 'critical',
        severity: 'critical',
        status: 'in-progress',
        project: projects[0]._id,
        assignedTo: users[2]._id,
        reportedBy: users[0]._id,
      },
      {
        issueId: generateIssueId(),
        title: 'Update UI components',
        description: 'Need to update UI components to new design',
        priority: 'medium',
        severity: 'minor',
        status: 'open',
        project: projects[1]._id,
        reportedBy: users[3]._id,
      },
    ]);

    console.log('Created sample issues');
    console.log('Database seeding completed successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
