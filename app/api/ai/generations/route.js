import { connectDB } from '../../../../lib/db.js';
import { protectRequest } from '../../../../lib/auth.js';
import { getUserGenerations } from '../../../../lib/generation.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await connectDB();
    const user = await protectRequest(request);
    const generations = await getUserGenerations(user._id);
    return json({ success: true, generations });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
