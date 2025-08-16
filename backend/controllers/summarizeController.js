const aiService = require('../utils/aiService');
const Summary = require('../models/Summary');
const { v4: uuidv4 } = require('uuid');

// Generate summary from transcript and prompt
const generateSummary = async (req, res) => {
  try {
    const { transcript, prompt, style = 'custom', language = 'en', provider } = req.body;
    const userId = req.body.userId || uuidv4(); // Generate temporary user ID if not provided

    // Validate required fields
    if (!transcript || !prompt) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Transcript and prompt are required'
      });
    }

    // Validate transcript
    try {
      aiService.validateTranscript(transcript);
    } catch (error) {
      return res.status(400).json({
        error: 'Invalid transcript',
        message: error.message
      });
    }

    // Generate summary using AI service
    let aiResult;
    if (style !== 'custom') {
      aiResult = await aiService.generateSummaryWithStyle(transcript, style, prompt);
    } else {
      aiResult = await aiService.generateSummary(transcript, prompt, provider);
    }

    // Create summary document
    const summary = new Summary({
      userId,
      transcript,
      prompt,
      generatedSummary: aiResult.summary,
      summaryStyle: style,
      language,
      metadata: {
        processingTime: aiResult.processingTime,
        aiProvider: aiResult.provider
      }
    });

    // Save to database
    await summary.save();

    // Return response
    res.status(200).json({
      success: true,
      data: {
        id: summary._id,
        summary: aiResult.summary,
        processingTime: aiResult.processingTime,
        provider: aiResult.provider,
        userId: summary.userId,
        createdAt: summary.createdAt
      }
    });

  } catch (error) {
    console.error('Summary generation error:', error);
    
    // Handle specific AI API errors
    if (error.message.includes('API Error')) {
      return res.status(503).json({
        error: 'AI Service Unavailable',
        message: error.message
      });
    }

    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to generate summary'
    });
  }
};

// Update summary (for editing)
const updateSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const { editedSummary } = req.body;

    if (!editedSummary) {
      return res.status(400).json({
        error: 'Missing edited summary',
        message: 'Edited summary is required'
      });
    }

    const summary = await Summary.findById(id);
    
    if (!summary) {
      return res.status(404).json({
        error: 'Summary not found',
        message: 'Summary with the provided ID does not exist'
      });
    }

    summary.editedSummary = editedSummary;
    await summary.save();

    res.status(200).json({
      success: true,
      data: {
        id: summary._id,
        editedSummary: summary.editedSummary,
        updatedAt: summary.updatedAt
      }
    });

  } catch (error) {
    console.error('Summary update error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update summary'
    });
  }
};

// Get summary by ID
const getSummary = async (req, res) => {
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
    console.error('Get summary error:', error);
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

// Get available AI providers
const getProviders = async (req, res) => {
  try {
    const providers = [];
    
    if (process.env.GROQ_API_KEY) {
      providers.push({
        id: 'groq',
        name: 'Groq',
        model: 'llama3-8b-8192',
        available: true
      });
    }
    
    if (process.env.OPENAI_API_KEY) {
      providers.push({
        id: 'openai',
        name: 'OpenAI',
        model: 'gpt-3.5-turbo',
        available: true
      });
    }

    res.status(200).json({
      success: true,
      data: {
        providers,
        default: providers.length > 0 ? providers[0].id : null
      }
    });

  } catch (error) {
    console.error('Get providers error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get AI providers'
    });
  }
};

// Get summary styles
const getSummaryStyles = async (req, res) => {
  try {
    const styles = [
      {
        id: 'executive',
        name: 'Executive Summary',
        description: 'High-level summary with key decisions and business impact',
        prompt: 'Create an executive summary with key points, decisions made, and next steps. Focus on high-level insights and business impact.'
      },
      {
        id: 'action-items',
        name: 'Action Items',
        description: 'Extract all action items, assignments, and deadlines',
        prompt: 'Extract all action items, assignments, and deadlines from the meeting. Organize by person responsible and priority.'
      },
      {
        id: 'technical',
        name: 'Technical Notes',
        description: 'Technical discussions, specifications, and implementation details',
        prompt: 'Provide a technical summary focusing on technical discussions, specifications, architecture decisions, and implementation details.'
      },
      {
        id: 'custom',
        name: 'Custom',
        description: 'Use your own custom prompt',
        prompt: ''
      }
    ];

    res.status(200).json({
      success: true,
      data: styles
    });

  } catch (error) {
    console.error('Get styles error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get summary styles'
    });
  }
};

module.exports = {
  generateSummary,
  updateSummary,
  getSummary,
  deleteSummary,
  getProviders,
  getSummaryStyles
};
