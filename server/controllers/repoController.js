import Repository from '../models/Repository.js';
import User from '../models/User.js';
import {
  getUserRepositories,
  analyzeRepository,
} from '../services/githubService.js';

export const syncRepositories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+accessToken');

    if (!user.accessToken) {
      return res.status(400).json({
        success: false,
        message: 'GitHub access token not found. Please re-authenticate.',
      });
    }

    const githubRepos = await getUserRepositories(user.accessToken);

    const operations = githubRepos.map((repo) =>
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
    );

    await Promise.all(operations);

    const repos = await Repository.find({ userId: user._id }).sort({ updatedAt: -1 });

    res.json({ success: true, count: repos.length, repositories: repos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRepositories = async (req, res) => {
  try {
    const repos = await Repository.find({ userId: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, count: repos.length, repositories: repos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRepository = async (req, res) => {
  try {
    const repo = await Repository.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!repo) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }

    res.json({ success: true, repository: repo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const analyzeRepo = async (req, res) => {
  try {
    const repo = await Repository.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!repo) {
      return res.status(404).json({ success: false, message: 'Repository not found' });
    }

    const user = await User.findById(req.user._id).select('+accessToken');
    const [owner, repoName] = repo.fullName.split('/');

    const analysis = await analyzeRepository(
      user.accessToken,
      owner,
      repoName
    );

    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
