const { execSync } = require('child_process');
const path = require('path');

console.log('Testing build process...');

try {
  // Change to frontend directory
  process.chdir(path.join(__dirname, 'frontend'));
  
  console.log('Installing dependencies...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  
  console.log('Building application...');
  execSync('npx react-scripts build', { stdio: 'inherit' });
  
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
