import { json } from '../../../lib/response.js';
import { env } from '../../../lib/env.js';

export const runtime = 'nodejs';

export async function GET() {
  return json({
    success: true,
    message: 'DevPilot AI API is running',
    provider: env.ai.provider,
    timestamp: new Date().toISOString(),
  });
}
