import Generation from './models/Generation.js';

export const checkAndIncrementGeneration = async (user) => {
  user.resetMonthlyCountIfNeeded();

  if (!user.canGenerate()) {
    throw new Error('Monthly generation limit reached. Upgrade to Pro for unlimited generations.');
  }

  if (user.plan === 'free') {
    user.generationsThisMonth += 1;
    await user.save();
  }

  return user;
};

export const saveGeneration = async (userId, type, prompt, response, metadata = {}) => {
  return Generation.create({ userId, type, prompt, response, metadata });
};

export const getUserGenerations = async (userId, limit = 20) => {
  return Generation.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .select('-prompt');
};
