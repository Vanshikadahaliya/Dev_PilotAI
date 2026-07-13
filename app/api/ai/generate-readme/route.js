import { connectDB } from '../../../../lib/db.js';
import { protectRequest } from '../../../../lib/auth.js';
import User from '../../../../lib/models/User.js';
import Repository from '../../../../lib/models/Repository.js';
import { analyzeRepository } from '../../../../lib/github.js';
import { generateReadme } from '../../../../lib/ai.js';
import { checkAndIncrementGeneration, saveGeneration } from '../../../../lib/generation.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

async function getRepoAnalysis(userId, repoId) {
  const repo = await Repository.findOne({ _id: repoId, userId });
  if (!repo) throw new Error('Repository not found');

  const user = await User.findById(userId).select('+accessToken');
  const [owner, repoName] = repo.fullName.split('/');
  return analyzeRepository(user.accessToken, owner, repoName);
}

export async function POST(request) {
  try {
    await connectDB();
    const user = await protectRequest(request);
    const { repoId } = await request.json();

    if (!repoId) return errorResponse('repoId is required', 400);

    await checkAndIncrementGeneration(user);
    const analysis = await getRepoAnalysis(user._id, repoId);
    const readme = await generateReadme(analysis);

    await saveGeneration(user._id, 'readme', JSON.stringify({ repoId }), readme, {
      repoName: analysis.fullName,
    });

    return json({ success: true, readme, analysis });
  } catch (error) {
    const status = error.message.includes('limit') ? 403 : 500;
    return errorResponse(error.message, status);
  }
}
