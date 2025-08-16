const express = require('express');
const router = express.Router();
const {
  sendEmail,
  sendBulkEmails,
  testEmailConfig,
  getEmailStatus,
  getEmailLogs,
  validateEmails
} = require('../controllers/emailController');

// Send summary via email
router.post('/send', sendEmail);

// Send bulk emails
router.post('/send-bulk', sendBulkEmails);

// Test email configuration
router.get('/test', testEmailConfig);

// Get email configuration status
router.get('/status', getEmailStatus);

// Get email logs for a summary
router.get('/logs/:summaryId', getEmailLogs);

// Validate email addresses
router.post('/validate', validateEmails);

module.exports = router;
