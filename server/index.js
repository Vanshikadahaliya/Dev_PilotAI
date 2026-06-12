import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import repoRoutes from './routes/repos.js';
import aiRoutes from './routes/ai.js';

const app = express();

connectDB();

app.use(morgan(env.isDev ? 'dev' : 'combined'));
app.use(cors({
  origin: env.clientUrl,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'DevPilot AI API is running',
    provider: env.ai.provider,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/repos', repoRoutes);
app.use('/api/ai', aiRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`DevPilot AI server running on port ${env.port}`);
  console.log(`Environment: ${env.nodeEnv}`);
  console.log(`AI Provider: ${env.ai.provider}`);
});
