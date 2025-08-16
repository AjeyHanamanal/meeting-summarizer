# Deployment Guide

## Frontend Deployment (Netlify)

### 1. Build the Frontend
```bash
cd frontend
npm run build
```

### 2. Deploy to Netlify
- Connect your GitHub repository to Netlify
- **Build command**: `cd frontend && npm ci && npm run build`
- **Publish directory**: `frontend/build`
- **Node version**: 18
- Deploy!

**Alternative**: Use the `netlify.toml` file in the root directory for automatic configuration.

**If you still have issues**: Use `netlify-minimal.toml` as a backup configuration.

### 3. Environment Variables in Netlify
Add these environment variables in Netlify dashboard:
- `REACT_APP_API_URL` = Your backend URL (e.g., https://your-backend.herokuapp.com)
- `NODE_ENV` = production

**Important**: Make sure to set the `REACT_APP_API_URL` to your actual deployed backend URL.

## Backend Deployment (Heroku/Railway/Render)

### Option 1: Heroku
1. Create a new Heroku app
2. Connect your GitHub repository
3. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_uri
   GROQ_API_KEY=your_groq_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   JWT_SECRET=your_jwt_secret
   NODE_ENV=production
   ```
4. Deploy!

### Option 2: Railway
1. Connect your GitHub repository to Railway
2. Set environment variables (same as above)
3. Deploy!

### Option 3: Render
1. Create a new Web Service
2. Connect your GitHub repository
3. Set environment variables (same as above)
4. Deploy!

## Important Notes

1. **CORS Configuration**: Update `CORS_ORIGIN` in backend to include your Netlify domain
2. **API URL**: Update `REACT_APP_API_URL` in frontend to point to your deployed backend
3. **MongoDB**: Use MongoDB Atlas for production database
4. **Environment Variables**: Never commit sensitive data to Git

## Troubleshooting

- If you get 404 errors on Netlify, make sure the `_redirects` file is in the `frontend/public` folder
- If API calls fail, check CORS settings and API URL configuration
- If build fails, check Node.js version compatibility
