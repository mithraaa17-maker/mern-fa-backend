const axios = require('axios');
const Issue = require('../models/Issue');
const { generateIssueId } = require('../utils/generateId');

const syncService = {
  async syncExternalDataset() {
    const results = {
      success: false,
      totalFetched: 0,
      inserted: 0,
      duplicates: 0,
      rejected: 0,
      errors: []
    };

    try {
      // Placeholder logic for external API integration
      // In production, replace with actual API call
      // const response = await axios.get(process.env.EXTERNAL_API_URL, {
      //   headers: {
      //     'Authorization': `Bearer ${process.env.EXTERNAL_API_KEY}`
      //   }
      // });

      // Mock data for demonstration
      const mockData = [
        { title: 'External Issue 1', description: 'Test', priority: 'high' },
        { title: 'External Issue 2', description: 'Test', priority: 'low' }
      ];

      results.totalFetched = mockData.length;

      for (const data of mockData) {
        try {
          // Validate record
          if (!data.title) {
            results.rejected++;
            results.errors.push({ data, error: 'Missing title' });
            continue;
          }

          // Check for duplicates
          const existingIssue = await Issue.findOne({ 
            title: data.title,
            description: data.description 
          });

          if (existingIssue) {
            results.duplicates++;
            continue;
          }

          // Insert valid record
          await Issue.create({
            issueId: generateIssueId(),
            title: data.title,
            description: data.description,
            priority: data.priority || 'medium',
            severity: 'minor',
            status: 'open',
            project: null, // Will need to be linked manually
            reportedBy: null, // Will need to be linked manually
          });

          results.inserted++;
        } catch (error) {
          results.rejected++;
          results.errors.push({ data, error: error.message });
        }
      }

      results.success = true;
      return results;
    } catch (error) {
      results.errors.push({ error: error.message });
      return results;
    }
  }
};

module.exports = syncService;
