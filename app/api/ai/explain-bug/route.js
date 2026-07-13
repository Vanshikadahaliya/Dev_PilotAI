import { connectDB } from '../../../../lib/db.js';
import { protectRequest } from '../../../../lib/auth.js';
import { explainBug } from '../../../../lib/ai.js';
import { checkAndIncrementGeneration, saveGeneration } from '../../../../lib/generation.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await connectDB();
    const user = await protectRequest(request);
    const { errorMessage, stackTrace } = await request.json();

    if (!errorMessage) {
      return errorResponse('errorMessage is required', 400);
    }

    await checkAndIncrementGeneration(user);
    const explanation = await explainBug(errorMessage, stackTrace);

    await saveGeneration(user._id, 'bug-explain', JSON.stringify({ errorMessage }), explanation);

    return json({ success: true, explanation });
  } catch (error) {
    const status = error.message.includes('limit') ? 403 : 500;
    return errorResponse(error.message, status);
  }
}
