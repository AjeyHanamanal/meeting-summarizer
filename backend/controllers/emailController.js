const emailService = require('../utils/emailService');
const Summary = require('../models/Summary');

// Send summary via email
const sendEmail = async (req, res) => {
  try {
    const { summaryId, recipients, subject = 'Meeting Summary', summary } = req.body;

    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        error: 'Invalid recipients',
        message: 'At least one recipient email is required'
      });
    }

    if (!summary && !summaryId) {
      return res.status(400).json({
        error: 'Missing summary',
        message: 'Either summary text or summaryId is required'
      });
    }

    let summaryText = summary;
    let summaryDoc = null;

    // If summaryId is provided, get summary from database
    if (summaryId) {
      summaryDoc = await Summary.findById(summaryId);
      if (!summaryDoc) {
        return res.status(404).json({
          error: 'Summary not found',
          message: 'Summary with the provided ID does not exist'
        });
      }
      summaryText = summaryDoc.editedSummary || summaryDoc.generatedSummary;
    }

    // Send email
    const emailResult = await emailService.sendSummaryEmail(recipients, summaryText, subject);

    // Log email activity if summaryId is provided
    if (summaryDoc) {
      await summaryDoc.addEmailLog(recipients, subject, 'sent');
    }

    res.status(200).json({
      success: true,
      data: {
        messageId: emailResult.messageId,
        recipients: emailResult.recipients,
        subject: subject,
        sentAt: new Date()
      }
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Handle specific email errors
    if (error.message.includes('Email configuration missing')) {
      return res.status(503).json({
        error: 'Email Service Unavailable',
        message: 'Email service is not configured properly'
      });
    }

    if (error.message.includes('Invalid email addresses')) {
      return res.status(400).json({
        error: 'Invalid Email Addresses',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to send email'
    });
  }
};

// Send bulk emails
const sendBulkEmails = async (req, res) => {
  try {
    const { summaryId, recipients, subject = 'Meeting Summary', summary } = req.body;

    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        error: 'Invalid recipients',
        message: 'At least one recipient email is required'
      });
    }

    if (!summary && !summaryId) {
      return res.status(400).json({
        error: 'Missing summary',
        message: 'Either summary text or summaryId is required'
      });
    }

    let summaryText = summary;
    let summaryDoc = null;

    // If summaryId is provided, get summary from database
    if (summaryId) {
      summaryDoc = await Summary.findById(summaryId);
      if (!summaryDoc) {
        return res.status(404).json({
          error: 'Summary not found',
          message: 'Summary with the provided ID does not exist'
        });
      }
      summaryText = summaryDoc.editedSummary || summaryDoc.generatedSummary;
    }

    // Send bulk emails
    const emailResults = await emailService.sendBulkEmails(recipients, summaryText, subject);

    // Log successful emails if summaryId is provided
    if (summaryDoc) {
      const successfulEmails = emailResults.filter(result => result.success);
      for (const result of successfulEmails) {
        await summaryDoc.addEmailLog([result.email], subject, 'sent');
      }
    }

    // Calculate statistics
    const successful = emailResults.filter(result => result.success).length;
    const failed = emailResults.filter(result => !result.success).length;

    res.status(200).json({
      success: true,
      data: {
        total: emailResults.length,
        successful,
        failed,
        results: emailResults,
        sentAt: new Date()
      }
    });

  } catch (error) {
    console.error('Bulk email sending error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to send bulk emails'
    });
  }
};

// Test email configuration
const testEmailConfig = async (req, res) => {
  try {
    const testResult = await emailService.testConnection();
    
    if (testResult.success) {
      res.status(200).json({
        success: true,
        message: testResult.message
      });
    } else {
      res.status(503).json({
        success: false,
        error: 'Email Configuration Error',
        message: testResult.error
      });
    }

  } catch (error) {
    console.error('Email config test error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to test email configuration'
    });
  }
};

// Get email configuration status
const getEmailStatus = async (req, res) => {
  try {
    const stats = emailService.getEmailStats();
    
    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get email status error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get email status'
    });
  }
};

// Get email logs for a summary
const getEmailLogs = async (req, res) => {
  try {
    const { summaryId } = req.params;

    const summary = await Summary.findById(summaryId);
    
    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found',
        message: 'Summary with the provided ID does not exist'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summaryId: summary._id,
        emailLogs: summary.emailLogs,
        totalEmails: summary.emailLogs.length
      }
    });

  } catch (error) {
    console.error('Get email logs error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get email logs'
    });
  }
};

// Validate email addresses
const validateEmails = async (req, res) => {
  try {
    const { emails } = req.body;

    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Emails array is required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validationResults = emails.map(email => ({
      email,
      valid: emailRegex.test(email)
    }));

    const validEmails = validationResults.filter(result => result.valid).map(result => result.email);
    const invalidEmails = validationResults.filter(result => !result.valid).map(result => result.email);

    res.status(200).json({
      success: true,
      data: {
        total: emails.length,
        valid: validEmails.length,
        invalid: invalidEmails.length,
        validEmails,
        invalidEmails,
        validationResults
      }
    });

  } catch (error) {
    console.error('Email validation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to validate emails'
    });
  }
};

module.exports = {
  sendEmail,
  sendBulkEmails,
  testEmailConfig,
  getEmailStatus,
  getEmailLogs,
  validateEmails
};
