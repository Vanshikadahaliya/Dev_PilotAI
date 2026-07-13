import { connectDB } from '../../../../lib/db.js';
import { protectRequest } from '../../../../lib/auth.js';
import Repository from '../../../../lib/models/Repository.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await protectRequest(request);
    const repo = await Repository.findOne({ _id: params.id, userId: user._id });

    if (!repo) {
      return errorResponse('Repository not found', 404);
    }

    return json({ success: true, repository: repo });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
