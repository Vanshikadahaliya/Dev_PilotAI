import { connectDB } from '../../../lib/db.js';
import { protectRequest } from '../../../lib/auth.js';
import Repository from '../../../lib/models/Repository.js';
import { errorResponse, json } from '../../../lib/response.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await connectDB();
    const user = await protectRequest(request);
    const repos = await Repository.find({ userId: user._id }).sort({ updatedAt: -1 });

    return json({ success: true, count: repos.length, repositories: repos });
  } catch (error) {
    return errorResponse(error.message, 401);
  }
}
