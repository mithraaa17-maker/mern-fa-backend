const generateUserId = () => {
  return 'USR' + Date.now().toString().slice(-9);
};

const generateProjectId = () => {
  return 'PRJ' + Date.now().toString().slice(-9);
};

const generateIssueId = () => {
  return 'ISS' + Date.now().toString().slice(-9);
};

const generateCommentId = () => {
  return 'COM' + Date.now().toString().slice(-9);
};

module.exports = {
  generateUserId,
  generateProjectId,
  generateIssueId,
  generateCommentId
};
