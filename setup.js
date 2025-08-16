#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up AI Meeting Summarizer...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js first.');
  process.exit(1);
}

// Check if npm is installed
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm version: ${npmVersion}`);
} catch (error) {
  console.error('❌ npm is not installed. Please install npm first.');
  process.exit(1);
}

// Install root dependencies
console.log('\n📦 Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Root dependencies installed');
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

// Install backend dependencies
console.log('\n📦 Installing backend dependencies...');
try {
  execSync('cd backend && npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install backend dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('\n📦 Installing frontend dependencies...');
try {
  execSync('cd frontend && npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Create environment files
console.log('\n⚙️  Creating environment files...');

// Backend .env
const backendEnvPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(backendEnvPath)) {
  const backendEnvContent = `# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/meeting-summarizer?retryWrites=true&w=majority

# AI API Configuration
GROQ_API_KEY=your_groq_api_key_here
# Alternative: OpenAI API
# OPENAI_API_KEY=your_openai_api_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
EMAIL_FROM=your_email@gmail.com

# Security
JWT_SECRET=your_super_secret_jwt_key_here
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
`;

  fs.writeFileSync(backendEnvPath, backendEnvContent);
  console.log('✅ Backend .env file created');
} else {
  console.log('ℹ️  Backend .env file already exists');
}

// Frontend .env
const frontendEnvPath = path.join(__dirname, 'frontend', '.env');
if (!fs.existsSync(frontendEnvPath)) {
  const frontendEnvContent = `# API Configuration
REACT_APP_API_URL=http://localhost:5000

# Optional: Custom branding
REACT_APP_APP_NAME=AI Meeting Summarizer
REACT_APP_APP_VERSION=1.0.0
`;

  fs.writeFileSync(frontendEnvPath, frontendEnvContent);
  console.log('✅ Frontend .env file created');
} else {
  console.log('ℹ️  Frontend .env file already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Configure your environment variables:');
console.log('   - Edit backend/.env with your MongoDB, AI API, and email credentials');
console.log('   - Edit frontend/.env if needed');
console.log('\n2. Start the development servers:');
console.log('   npm run dev');
console.log('\n3. Open http://localhost:3000 in your browser');
console.log('\n📚 For more information, see the README.md file');
