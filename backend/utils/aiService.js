const axios = require('axios');

class AIService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY;
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.groqBaseUrl = 'https://api.groq.com/openai/v1';
    this.openaiBaseUrl = 'https://api.openai.com/v1';
  }

  // Get the preferred AI provider
  getPreferredProvider() {
    if (this.groqApiKey) return 'groq';
    if (this.openaiApiKey) return 'openai';
    throw new Error('No AI API key configured');
  }

  // Generate summary using Groq API
  async generateSummaryWithGroq(transcript, prompt) {
    try {
      const response = await axios.post(
        `${this.groqBaseUrl}/chat/completions`,
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'You are an expert meeting summarizer. Create clear, concise, and well-structured summaries based on the provided transcript and prompt.'
            },
            {
              role: 'user',
              content: `Transcript: ${transcript}\n\nPrompt: ${prompt}\n\nPlease provide a summary based on the above transcript and prompt.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
          top_p: 1,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Groq API Error:', error.response?.data || error.message);
      throw new Error(`Groq API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Generate summary using OpenAI API
  async generateSummaryWithOpenAI(transcript, prompt) {
    try {
      const response = await axios.post(
        `${this.openaiBaseUrl}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are an expert meeting summarizer. Create clear, concise, and well-structured summaries based on the provided transcript and prompt.'
            },
            {
              role: 'user',
              content: `Transcript: ${transcript}\n\nPrompt: ${prompt}\n\nPlease provide a summary based on the above transcript and prompt.`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error.response?.data || error.message);
      throw new Error(`OpenAI API Error: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Main method to generate summary
  async generateSummary(transcript, prompt, provider = null) {
    const startTime = Date.now();
    
    try {
      // Validate inputs
      if (!transcript || transcript.trim().length === 0) {
        throw new Error('Transcript is required');
      }
      
      if (!prompt || prompt.trim().length === 0) {
        throw new Error('Prompt is required');
      }

      // Determine provider
      const selectedProvider = provider || this.getPreferredProvider();
      
      let summary;
      switch (selectedProvider) {
        case 'groq':
          if (!this.groqApiKey) {
            throw new Error('Groq API key not configured');
          }
          summary = await this.generateSummaryWithGroq(transcript, prompt);
          break;
          
        case 'openai':
          if (!this.openaiApiKey) {
            throw new Error('OpenAI API key not configured');
          }
          summary = await this.generateSummaryWithOpenAI(transcript, prompt);
          break;
          
        default:
          throw new Error(`Unsupported AI provider: ${selectedProvider}`);
      }

      const processingTime = Date.now() - startTime;
      
      return {
        summary,
        processingTime,
        provider: selectedProvider
      };
      
    } catch (error) {
      console.error('Summary generation error:', error);
      throw error;
    }
  }

  // Generate summary with style presets
  async generateSummaryWithStyle(transcript, style = 'custom', customPrompt = '') {
    const stylePrompts = {
      'executive': 'Create an executive summary with key points, decisions made, and next steps. Focus on high-level insights and business impact.',
      'action-items': 'Extract all action items, assignments, and deadlines from the meeting. Organize by person responsible and priority.',
      'technical': 'Provide a technical summary focusing on technical discussions, specifications, architecture decisions, and implementation details.',
      'custom': customPrompt || 'Create a comprehensive summary of the meeting covering main topics, decisions, and key takeaways.'
    };

    const prompt = stylePrompts[style] || stylePrompts.custom;
    return this.generateSummary(transcript, prompt);
  }

  // Validate transcript length
  validateTranscript(transcript) {
    const wordCount = transcript.split(/\s+/).length;
    const charCount = transcript.length;
    
    if (charCount > 50000) {
      throw new Error('Transcript too long. Maximum 50,000 characters allowed.');
    }
    
    if (wordCount < 10) {
      throw new Error('Transcript too short. Please provide more content.');
    }
    
    return { wordCount, charCount };
  }
}

module.exports = new AIService();
