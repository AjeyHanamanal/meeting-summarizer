// Environment configuration for the frontend
const config = {
  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://your-backend-url.herokuapp.com' 
        : 'http://localhost:5000'),
    timeout: 30000,
  },
  
  // App Configuration
  app: {
    name: process.env.REACT_APP_APP_NAME || 'AI Meeting Summarizer',
    version: process.env.REACT_APP_APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  },
  
  // Feature flags
  features: {
    enableEmail: true,
    enableExport: true,
    enableHistory: true,
  }
};

export default config;
