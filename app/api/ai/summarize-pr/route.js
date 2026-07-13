import { connectDB } from '../../../../lib/db.js';
import { protectRequest } from '../../../../lib/auth.js';
import { summarizePR } from '../../../../lib/ai.js';
import { checkAndIncrementGeneration, saveGeneration } from '../../../../lib/generation.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await connectDB();
    const user = await protectRequest(request);

    if (user.plan !== 'pro') {
      return errorResponse('PR Summaries require a Pro plan.', 403);
    }

    const { prDescription, changedFiles } = await request.json();

    if (!prDescription && !changedFiles) {
      return errorResponse('PR description or changed files required', 400);
    }

    await checkAndIncrementGeneration(user);
    const summary = await summarizePR(prDescription, changedFiles);

    await saveGeneration(user._id, 'pr-summary', JSON.stringify({ prDescription, changedFiles }), summary);

    return json({ success: true, summary });
  } catch (error) {
    const status = error.message.includes('limit') ? 403 : 500;
    return errorResponse(error.message, status);
  }
}
