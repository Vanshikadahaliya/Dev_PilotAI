# DevPilot AI

AI-powered Developer Copilot that helps developers generate professional GitHub READMEs, analyze repositories, create portfolio websites, generate project descriptions, summarize pull requests, and explain bugs.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React, Next.js App Router, Tailwind CSS, Framer Motion |
| Backend | Next.js Route Handlers, Node.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | GitHub OAuth + JWT |
| AI | OpenAI / Gemini (configurable) |
| Deploy | Vercel (full-stack) |

## Project Structure

```
dev_pilotAI/
├── app/                    # Next.js App Router
│   ├── api/                # API route handlers
│   │   ├── auth/           # Authentication routes
│   │   ├── repos/          # Repository routes
│   │   ├── ai/             # AI generation routes
│   │   └── health/         # Health check
│   ├── dashboard/          # Dashboard pages
│   ├── auth/               # Auth pages
│   ├── layout.jsx          # Root layout with providers
│   └── page.jsx            # Landing page
├── lib/                    # Shared utilities
│   ├── models/             # Mongoose schemas
│   ├── db.js               # Database connection
│   ├── auth.js             # JWT authentication
│   ├── github.js           # GitHub API client
│   ├── ai.js               # AI provider integration
│   ├── generation.js       # Generation tracking
│   ├── env.js              # Environment config
│   └── response.js         # Response helpers
├── context/                # React context providers
│   ├── AuthContext.jsx     # Auth state
│   └── ThemeContext.jsx    # Theme state
├── components/             # Reusable UI components
├── hooks/                  # Custom React hooks
├── layouts/                # Layout components
├── views/                  # Page view components
├── services/               # API client utilities
├── eslint.config.js        # ESLint configuration
├── next.config.js          # Next.js configuration
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
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `http://localhost:3000/api/auth/github/callback`
     - Important: the **Callback URL must match exactly** the `GITHUB_CALLBACK_URL` in `.env.local` (including protocol and port).
3. Copy Client ID and Client Secret

### 2. Setup

```bash
cp .env.example .env.local
# Fill in:
# - MONGODB_URI
# - JWT_SECRET
# - GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
# - OPENAI_API_KEY (or GEMINI_API_KEY, or OPENROUTER_API_KEY)

npm install
npm run dev
```

App runs at `http://localhost:3000`

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/auth/github` | GitHub OAuth (GET = initiate, POST = mobile) |
| GET | `/api/auth/github/callback` | OAuth callback handler |
| GET | `/api/auth/me` | Get current user info |
| POST | `/api/auth/upgrade` | Upgrade to Pro plan |
| GET | `/api/repos/sync` | Sync GitHub repos |
| GET | `/api/repos` | List user repos |
| GET | `/api/repos/[id]` | Get single repo |
| GET | `/api/repos/[id]/analyze` | Analyze repository |
| POST | `/api/ai/generate-readme` | Generate README |
| POST | `/api/ai/generate-description` | Generate descriptions |
| POST | `/api/ai/generate-portfolio` | Generate portfolio (Pro) |
| POST | `/api/ai/summarize-pr` | Summarize PR (Pro) |
| POST | `/api/ai/explain-bug` | Explain bug |
| GET | `/api/ai/generations` | Get user's generation history |
| GET | `/api/health` | Health check |

## AI Provider Configuration

Set `AI_PROVIDER=openai` or `AI_PROVIDER=gemini` in server `.env`.

## Deployment

### Vercel

1. Connect your GitHub repository to Vercel
2. Set environment variables in project settings:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
   - `GITHUB_CALLBACK_URL=https://yourdomain.com/api/auth/github/callback`
   - `OPENAI_API_KEY` (or your preferred AI provider)
   - `NODE_ENV=production`
3. Deploy

## Pricing Plans

- **Free**: 5 AI generations/month
- **Pro**: Unlimited generations, Portfolio Builder, PR Summaries

## License

MIT
