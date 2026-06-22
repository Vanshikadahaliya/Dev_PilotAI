# DevPilot AI

AI-powered Developer Copilot that helps developers generate professional GitHub READMEs, analyze repositories, create portfolio websites, generate project descriptions, summarize pull requests, and explain bugs.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Vite, Tailwind CSS, React Router, Axios, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | GitHub OAuth + JWT |
| AI | OpenAI / Gemini (configurable) |
| Deploy | Vercel (client) + Render (server) |

## Project Structure

```
dev_pilotAI/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/          # Route pages
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Dashboard layout
│   │   ├── services/       # API client (Axios)
│   │   ├── hooks/          # Custom React hooks
│   │   └── context/        # Auth context provider
│   └── vercel.json
├── server/                 # Express API
│   ├── config/             # DB & env config
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API route definitions
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, rate limiting, errors
│   ├── services/           # GitHub & AI business logic
│   └── render.yaml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- GitHub OAuth App
- OpenAI or Gemini API key

### 1. GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps**
2. Create a new app:
   - Homepage URL: `http://localhost:5173`
   - Callback URL: `http://localhost:5000/api/auth/github/callback`
     - Important: the **Callback URL must match exactly** the `GITHUB_CALLBACK_URL` in `server/.env` (including protocol and port). If the browser shows "site can't be reached" after authorizing, check this value and the `CLIENT_URL` in the server `.env`.
3. Copy Client ID and Client Secret

### 2. Backend Setup

```bash
cd server
cp .env.example .env
# Fill in MONGODB_URI, JWT_SECRET, GITHUB_*, AI keys
npm install
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Frontend Setup

```bash
cd client
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/auth/github` | Initiate GitHub OAuth |
| GET | `/api/auth/github/callback` | OAuth callback |
| POST | `/api/auth/github` | Mobile/token auth |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/repos/sync` | Sync GitHub repos |
| GET | `/api/repos` | List user repos |
| GET | `/api/repos/:id` | Get single repo |
| POST | `/api/ai/generate-readme` | Generate README |
| POST | `/api/ai/generate-description` | Generate descriptions |
| POST | `/api/ai/generate-portfolio` | Generate portfolio (Pro) |
| POST | `/api/ai/summarize-pr` | Summarize PR (Pro) |
| POST | `/api/ai/explain-bug` | Explain bug |

## AI Provider Configuration

Set `AI_PROVIDER=openai` or `AI_PROVIDER=gemini` in server `.env`.

## Deployment

### Frontend (Vercel)

1. Import `client/` directory
2. Set `VITE_API_URL` to your Render backend URL + `/api`
3. Deploy

### Backend (Render)

1. Create Web Service from `server/` directory
2. Use `render.yaml` or set env vars manually
3. Update `GITHUB_CALLBACK_URL` and `CLIENT_URL` to production URLs

## Pricing Plans

- **Free**: 5 AI generations/month
- **Pro**: Unlimited generations, Portfolio Builder, PR Summaries

## License

MIT
