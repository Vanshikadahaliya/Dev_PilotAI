import { connectDB } from '../../../../../lib/db.js';
import { protectRequest } from '../../../../../lib/auth.js';
import User from '../../../../../lib/models/User.js';
import Repository from '../../../../../lib/models/Repository.js';
import { analyzeRepository } from '../../../../../lib/github.js';
import { errorResponse, json } from '../../../../../lib/response.js';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const user = await protectRequest(request);
    const repo = await Repository.findOne({ _id: params.id, userId: user._id });

    if (!repo) {
      return errorResponse('Repository not found', 404);
    }

    const repoUser = await User.findById(user._id).select('+accessToken');
    const [owner, repoName] = repo.fullName.split('/');
    const analysis = await analyzeRepository(repoUser.accessToken, owner, repoName);

    return json({ success: true, analysis });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
