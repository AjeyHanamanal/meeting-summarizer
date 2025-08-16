const mongoose = require('mongoose');

const summarySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  transcript: {
    type: String,
    required: true,
    maxlength: 50000 // 50KB limit
  },
  prompt: {
    type: String,
    required: true,
    maxlength: 1000
  },
  generatedSummary: {
    type: String,
    required: true,
    maxlength: 10000
  },
  editedSummary: {
    type: String,
    maxlength: 10000
  },
  summaryStyle: {
    type: String,
    enum: ['executive', 'action-items', 'technical', 'custom'],
    default: 'custom'
  },
  language: {
    type: String,
    default: 'en'
  },
  emailLogs: [{
    recipients: [String],
    subject: String,
    sentAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['sent', 'failed'],
      default: 'sent'
    }
  }],
  metadata: {
    wordCount: Number,
    processingTime: Number,
    aiProvider: {
      type: String,
      enum: ['groq', 'openai'],
      default: 'groq'
    }
  }
}, {
  timestamps: true
});

// Index for efficient queries
summarySchema.index({ userId: 1, createdAt: -1 });
summarySchema.index({ createdAt: -1 });

// Virtual for summary length
summarySchema.virtual('summaryLength').get(function() {
  return this.generatedSummary ? this.generatedSummary.length : 0;
});

// Pre-save middleware to calculate word count
summarySchema.pre('save', function(next) {
  if (this.transcript) {
    this.metadata.wordCount = this.transcript.split(/\s+/).length;
  }
  next();
});

// Method to add email log
summarySchema.methods.addEmailLog = function(recipients, subject, status = 'sent') {
  this.emailLogs.push({
    recipients,
    subject,
    status,
    sentAt: new Date()
  });
  return this.save();
};

// Static method to get user's summary history
summarySchema.statics.getUserHistory = function(userId, limit = 20, skip = 0) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('-transcript') // Exclude transcript for performance
    .lean();
};

// Static method to get summary statistics
summarySchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalSummaries: { $sum: 1 },
        totalEmailsSent: { $sum: { $size: '$emailLogs' } },
        averageWordCount: { $avg: '$metadata.wordCount' },
        totalProcessingTime: { $sum: '$metadata.processingTime' }
      }
    }
  ]);
};

module.exports = mongoose.model('Summary', summarySchema);
