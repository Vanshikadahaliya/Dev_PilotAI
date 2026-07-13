import { connectDB } from '../../../../lib/db.js';
import { protectRequest } from '../../../../lib/auth.js';
import User from '../../../../lib/models/User.js';
import Repository from '../../../../lib/models/Repository.js';
import { getUserRepositories } from '../../../../lib/github.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await connectDB();
    const authedUser = await protectRequest(request);
    const user = await User.findById(authedUser._id).select('+accessToken');

    if (!user.accessToken) {
      return errorResponse('GitHub access token not found. Please re-authenticate.', 400);
    }

    const githubRepos = await getUserRepositories(user.accessToken);

    await Promise.all(
      githubRepos.map((repo) =>
        Repository.findOneAndUpdate(
          { userId: user._id, githubId: repo.id },
          {
            userId: user._id,
            githubId: repo.id,
            repoName: repo.name,
            fullName: repo.full_name,
            description: repo.description || '',
            language: repo.language || '',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            url: repo.html_url,
            updatedAt: repo.updated_at,
            defaultBranch: repo.default_branch,
          },
          { upsert: true, new: true }
        )
      )
    );

    const repos = await Repository.find({ userId: user._id }).sort({ updatedAt: -1 });

    return json({ success: true, count: repos.length, repositories: repos });
  } catch (error) {
    return errorResponse(error.message, 500);
  }
}
