import { connectDB } from '../../../../lib/db.js';
import { protectRequest } from '../../../../lib/auth.js';
import Repository from '../../../../lib/models/Repository.js';
import { generatePortfolio } from '../../../../lib/ai.js';
import { checkAndIncrementGeneration, saveGeneration } from '../../../../lib/generation.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await connectDB();
    const user = await protectRequest(request);

    if (user.plan !== 'pro') {
      return errorResponse('Portfolio Builder requires a Pro plan.', 403);
    }

    await checkAndIncrementGeneration(user);

    const repos = await Repository.find({ userId: user._id }).sort({ stars: -1 }).limit(15);
    const portfolio = await generatePortfolio(user, repos);

    await saveGeneration(user._id, 'portfolio', JSON.stringify({ username: user.username }), portfolio);

    return json({ success: true, portfolio });
  } catch (error) {
    const status = error.message.includes('limit') ? 403 : 500;
    return errorResponse(error.message, status);
  }
}
