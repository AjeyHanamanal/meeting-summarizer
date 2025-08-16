# AI Meeting Summarizer & Sharer

A production-ready web application that uses AI to summarize meeting transcripts and share them via email.

## Features

- **AI-Powered Summarization**: Generate summaries using Groq API or OpenAI API
- **Multiple Input Methods**: Upload .txt files or paste text directly
- **Custom Prompts**: Tailor summaries with custom prompts
- **Email Sharing**: Send summaries directly to recipients
- **Export Options**: Download summaries as PDF or Word documents
- **History Tracking**: View and manage past summaries
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React.js with TailwindCSS
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **AI API**: Groq API (or OpenAI API)
- **Email**: Nodemailer
- **File Export**: jsPDF, docx

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account
- Groq API key (or OpenAI API key)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-meeting-summarizer
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

4. **Configure Environment Variables**
   
   Edit `backend/.env`:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   GROQ_API_KEY=your_groq_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   JWT_SECRET=your_jwt_secret_key
   ```

   Edit `frontend/.env`:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

5. **Start Development Servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on http://localhost:5000
   - Frontend development server on http://localhost:3000

## API Endpoints

### POST /api/summarize
Generate AI summary from transcript and prompt.

**Request Body:**
```json
{
  "transcript": "Meeting transcript text...",
  "prompt": "Summarize in bullet points for executives"
}
```

### POST /api/send-email
Send summary via email.

**Request Body:**
```json
{
  "summary": "Generated summary text...",
  "recipients": ["email1@example.com", "email2@example.com"],
  "subject": "Meeting Summary"
}
```

### GET /api/history
Get user's summary history.

### POST /api/history
Save summary to history.

## Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard:
   - `REACT_APP_API_URL`: Your backend URL

### Backend (Render/Railway)

1. Deploy to Render:
   - Connect your GitHub repository
   - Set build command: `cd backend && npm install`
   - Set start command: `cd backend && npm start`
   - Add environment variables

2. Set environment variables in Render dashboard:
   - `MONGODB_URI`
   - `GROQ_API_KEY`
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `JWT_SECRET`

### Database (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add it to your backend environment variables

## Project Structure

```
ai-meeting-summarizer/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── App.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── server.js          # Express server
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
