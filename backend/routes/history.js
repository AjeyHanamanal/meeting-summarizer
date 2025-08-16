const express = require('express');
const router = express.Router();
const {
  getUserHistory,
  getUserStats,
  getSummaryById,
  deleteSummary,
  updateSummary,
  searchSummaries,
  getSummaryAnalytics
} = require('../controllers/historyController');

// Search summaries
router.get('/user/:userId/search', searchSummaries);

// Get summary analytics
router.get('/user/:userId/analytics', getSummaryAnalytics);

// Get user statistics
router.get('/user/:userId/stats', getUserStats);

// Get user's summary history
router.get('/user/:userId', getUserHistory);

// Get summary by ID (with full details)
router.get('/summary/:id', getSummaryById);

// Update summary
router.put('/summary/:id', updateSummary);

// Delete summary
router.delete('/summary/:id', deleteSummary);

module.exports = router;
