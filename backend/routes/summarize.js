const express = require('express');
const router = express.Router();
const {
  generateSummary,
  updateSummary,
  getSummary,
  deleteSummary,
  getProviders,
  getSummaryStyles
} = require('../controllers/summarizeController');

// Generate new summary
router.post('/', generateSummary);

// Get available AI providers
router.get('/providers/list', getProviders);

// Get summary styles
router.get('/styles/list', getSummaryStyles);

// Update existing summary
router.put('/:id', updateSummary);

// Get summary by ID
router.get('/:id', getSummary);

// Delete summary
router.delete('/:id', deleteSummary);

module.exports = router;
