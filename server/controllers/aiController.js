import User from '../models/User.js';
import Repository from '../models/Repository.js';
import {
  generateReadme,
  generateDescription,
  generatePortfolio,
  summarizePR,
  explainBug,
} from '../services/aiService.js';
import { analyzeRepository } from '../services/githubService.js';
import {
  checkAndIncrementGeneration,
  saveGeneration,
  getUserGenerations,
} from '../services/generationService.js';

const getRepoAnalysis = async (userId, repoId) => {
  const repo = await Repository.findOne({ _id: repoId, userId });
  if (!repo) throw new Error('Repository not found');

  const user = await User.findById(userId).select('+accessToken');
  const [owner, repoName] = repo.fullName.split('/');
  return analyzeRepository(user.accessToken, owner, repoName);
};

export const generateReadmeHandler = async (req, res) => {
  try {
    const { repoId } = req.body;
    if (!repoId) {
      return res.status(400).json({ success: false, message: 'repoId is required' });
    }

    await checkAndIncrementGeneration(req.user);

    const analysis = await getRepoAnalysis(req.user._id, repoId);
    const readme = await generateReadme(analysis);

    await saveGeneration(req.user._id, 'readme', JSON.stringify({ repoId }), readme, {
      repoName: analysis.fullName,
    });

    res.json({ success: true, readme, analysis });
  } catch (error) {
    console.error('[AI] generateReadmeHandler error', error);
    const status = error.message.includes('limit') ? 403 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const generateDescriptionHandler = async (req, res) => {
  try {
    const { repoId } = req.body;
    if (!repoId) {
      return res.status(400).json({ success: false, message: 'repoId is required' });
    }

    await checkAndIncrementGeneration(req.user);

    const analysis = await getRepoAnalysis(req.user._id, repoId);
    const descriptions = await generateDescription(analysis);

    await saveGeneration(
      req.user._id,
      'description',
      JSON.stringify({ repoId }),
      descriptions,
      { repoName: analysis.fullName }
    );

    res.json({ success: true, descriptions, analysis });
  } catch (error) {
    console.error('[AI] generateDescriptionHandler error', error);
    const status = error.message.includes('limit') ? 403 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const generatePortfolioHandler = async (req, res) => {
  try {
    if (req.user.plan !== 'pro') {
      return res.status(403).json({
        success: false,
        message: 'Portfolio Builder requires a Pro plan.',
      });
    }

    await checkAndIncrementGeneration(req.user);

    const repos = await Repository.find({ userId: req.user._id })
      .sort({ stars: -1 })
      .limit(15);

    const portfolio = await generatePortfolio(req.user, repos);

    await saveGeneration(
      req.user._id,
      'portfolio',
      JSON.stringify({ username: req.user.username }),
      portfolio
    );

    res.json({ success: true, portfolio });
  } catch (error) {
    console.error('[AI] generatePortfolioHandler error', error);
    const status = error.message.includes('limit') ? 403 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const summarizePRHandler = async (req, res) => {
  try {
    if (req.user.plan !== 'pro') {
      return res.status(403).json({
        success: false,
        message: 'PR Summaries require a Pro plan.',
      });
    }

    const { prDescription, changedFiles } = req.body;

    if (!prDescription && !changedFiles) {
      return res.status(400).json({
        success: false,
        message: 'PR description or changed files required',
      });
    }

    await checkAndIncrementGeneration(req.user);

    const summary = await summarizePR(prDescription, changedFiles);

    await saveGeneration(
      req.user._id,
      'pr-summary',
      JSON.stringify({ prDescription, changedFiles }),
      summary
    );

    res.json({ success: true, summary });
  } catch (error) {
    console.error('[AI] summarizePRHandler error', error);
    const status = error.message.includes('limit') ? 403 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const explainBugHandler = async (req, res) => {
  try {
    const { errorMessage, stackTrace } = req.body;

    if (!errorMessage) {
      return res.status(400).json({ success: false, message: 'errorMessage is required' });
    }

    await checkAndIncrementGeneration(req.user);

    const explanation = await explainBug(errorMessage, stackTrace);

    await saveGeneration(
      req.user._id,
      'bug-explain',
      JSON.stringify({ errorMessage }),
      explanation
    );

    res.json({ success: true, explanation });
  } catch (error) {
    console.error('[AI] explainBugHandler error', error);
    const status = error.message.includes('limit') ? 403 : 500;
    res.status(status).json({ success: false, message: error.message });
  }
};

export const getGenerations = async (req, res) => {
  try {
    const generations = await getUserGenerations(req.user._id);
    res.json({ success: true, generations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
