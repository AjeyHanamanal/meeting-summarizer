import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

// Summary API
export const summaryAPI = {
  // Generate summary
  generate: async (data) => {
    return api.post('/api/summarize', data);
  },

  // Update summary
  update: async (id, data) => {
    return api.put(`/api/summarize/${id}`, data);
  },

  // Get summary by ID
  getById: async (id) => {
    return api.get(`/api/summarize/${id}`);
  },

  // Delete summary
  delete: async (id) => {
    return api.delete(`/api/summarize/${id}`);
  },

  // Get available providers
  getProviders: async () => {
    return api.get('/api/summarize/providers/list');
  },

  // Get summary styles
  getStyles: async () => {
    return api.get('/api/summarize/styles/list');
  },
};

// Email API
export const emailAPI = {
  // Send email
  send: async (data) => {
    return api.post('/api/email/send', data);
  },

  // Send bulk emails
  sendBulk: async (data) => {
    return api.post('/api/email/send-bulk', data);
  },

  // Test email configuration
  testConfig: async () => {
    return api.get('/api/email/test');
  },

  // Get email status
  getStatus: async () => {
    return api.get('/api/email/status');
  },

  // Get email logs
  getLogs: async (summaryId) => {
    return api.get(`/api/email/logs/${summaryId}`);
  },

  // Validate emails
  validate: async (emails) => {
    return api.post('/api/email/validate', { emails });
  },
};

// History API
export const historyAPI = {
  // Get user history
  getUserHistory: async (userId, params = {}) => {
    return api.get(`/api/history/user/${userId}`, { params });
  },

  // Get user stats
  getUserStats: async (userId) => {
    return api.get(`/api/history/user/${userId}/stats`);
  },

  // Get summary by ID (full details)
  getSummaryById: async (id) => {
    return api.get(`/api/history/summary/${id}`);
  },

  // Update summary
  updateSummary: async (id, data) => {
    return api.put(`/api/history/summary/${id}`, data);
  },

  // Delete summary
  deleteSummary: async (id) => {
    return api.delete(`/api/history/summary/${id}`);
  },

  // Search summaries
  search: async (userId, params = {}) => {
    return api.get(`/api/history/user/${userId}/search`, { params });
  },

  // Get analytics
  getAnalytics: async (userId, params = {}) => {
    return api.get(`/api/history/user/${userId}/analytics`, { params });
  },
};

// Health check
export const healthAPI = {
  check: async () => {
    return api.get('/health');
  },
};

export default api;
