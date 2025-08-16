const Summary = require('../models/Summary');

// Get user's summary history
const getUserHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, search } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build query
    let query = { userId };
    
    if (search) {
      query.$or = [
        { prompt: { $regex: search, $options: 'i' } },
        { generatedSummary: { $regex: search, $options: 'i' } },
        { editedSummary: { $regex: search, $options: 'i' } }
      ];
    }

    // Get summaries with pagination
    const summaries = await Summary.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-transcript') // Exclude transcript for performance
      .lean();

    // Get total count for pagination
    const total = await Summary.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        summaries,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        }
      }
    });

  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve history'
    });
  }
};

// Get summary statistics for user
const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Summary.getUserStats(userId);
    
    // If no stats found, return default values
    if (!stats || stats.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalSummaries: 0,
          totalEmailsSent: 0,
          averageWordCount: 0,
          totalProcessingTime: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: stats[0]
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve user statistics'
    });
  }
};

// Get summary by ID (with full details)
const getSummaryById = async (req, res) => {
  try {
    const { id } = req.params;

    const summary = await Summary.findById(id);
    
    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found',
        message: 'Summary with the provided ID does not exist'
      });
    }

    res.status(200).json({
      success: true,
      data: summary
    });

  } catch (error) {
    console.error('Get summary by ID error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve summary'
    });
  }
};

// Delete summary
const deleteSummary = async (req, res) => {
  try {
    const { id } = req.params;

    const summary = await Summary.findByIdAndDelete(id);
    
    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found',
        message: 'Summary with the provided ID does not exist'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Summary deleted successfully'
    });

  } catch (error) {
    console.error('Delete summary error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to delete summary'
    });
  }
};

// Update summary
const updateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { editedSummary, prompt, summaryStyle, language } = req.body;

    const summary = await Summary.findById(id);
    
    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found',
        message: 'Summary with the provided ID does not exist'
      });
    }

    // Update fields if provided
    if (editedSummary !== undefined) {
      summary.editedSummary = editedSummary;
    }
    
    if (prompt !== undefined) {
      summary.prompt = prompt;
    }
    
    if (summaryStyle !== undefined) {
      summary.summaryStyle = summaryStyle;
    }
    
    if (language !== undefined) {
      summary.language = language;
    }

    await summary.save();

    res.status(200).json({
      success: true,
      data: {
        id: summary._id,
        editedSummary: summary.editedSummary,
        prompt: summary.prompt,
        summaryStyle: summary.summaryStyle,
        language: summary.language,
        updatedAt: summary.updatedAt
      }
    });

  } catch (error) {
    console.error('Update summary error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update summary'
    });
  }
};

// Search summaries
const searchSummaries = async (req, res) => {
  try {
    const { userId } = req.params;
    const { q, style, language, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build search query
    let query = { userId };
    
    if (q) {
      query.$or = [
        { prompt: { $regex: q, $options: 'i' } },
        { generatedSummary: { $regex: q, $options: 'i' } },
        { editedSummary: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (style) {
      query.summaryStyle = style;
    }
    
    if (language) {
      query.language = language;
    }
    
    if (dateFrom || dateTo) {
      query.createdAt = {};
      if (dateFrom) {
        query.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        query.createdAt.$lte = new Date(dateTo);
      }
    }

    // Execute search
    const summaries = await Summary.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-transcript')
      .lean();

    // Get total count
    const total = await Summary.countDocuments(query);

    // Calculate pagination
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: {
        summaries,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
          hasNextPage,
          hasPrevPage
        },
        searchParams: {
          query: q,
          style,
          language,
          dateFrom,
          dateTo
        }
      }
    });

  } catch (error) {
    console.error('Search summaries error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to search summaries'
    });
  }
};

// Get summary analytics
const getSummaryAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = '30d' } = req.query;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get analytics data
    const analytics = await Summary.aggregate([
      { $match: { userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          avgWordCount: { $avg: '$metadata.wordCount' },
          avgProcessingTime: { $avg: '$metadata.processingTime' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get style distribution
    const styleDistribution = await Summary.aggregate([
      { $match: { userId, createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: '$summaryStyle',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        period,
        startDate,
        endDate: now,
        dailyStats: analytics,
        styleDistribution,
        totalSummaries: analytics.reduce((sum, day) => sum + day.count, 0)
      }
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve analytics'
    });
  }
};

module.exports = {
  getUserHistory,
  getUserStats,
  getSummaryById,
  deleteSummary,
  updateSummary,
  searchSummaries,
  getSummaryAnalytics
};
