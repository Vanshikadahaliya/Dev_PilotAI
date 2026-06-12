import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { exchangeCodeForToken, getGitHubUser } from '../services/githubService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
};

export const githubAuth = (req, res) => {
  const params = new URLSearchParams({
    client_id: env.github.clientId,
    redirect_uri: env.github.callbackUrl,
    scope: 'read:user user:email repo',
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};

export const githubCallback = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.redirect(`${env.clientUrl}/login?error=no_code`);
    }

    const accessToken = await exchangeCodeForToken(
      code,
      env.github.clientId,
      env.github.clientSecret
    );

    const githubUser = await getGitHubUser(accessToken);

    let user = await User.findOne({ githubId: String(githubUser.id) });

    if (user) {
      user.accessToken = accessToken;
      user.username = githubUser.login;
      user.avatar = githubUser.avatar_url;
      user.email = githubUser.email;
      await user.save();
    } else {
      user = await User.create({
        githubId: String(githubUser.id),
        username: githubUser.login,
        avatar: githubUser.avatar_url,
        email: githubUser.email,
        accessToken,
      });
    }

    const token = generateToken(user._id);
    res.redirect(`${env.clientUrl}/auth/callback?token=${token}`);
  } catch (error) {
    console.error('GitHub OAuth error:', error.message);
    res.redirect(`${env.clientUrl}/login?error=auth_failed`);
  }
};

export const githubAuthMobile = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Authorization code required' });
    }

    const accessToken = await exchangeCodeForToken(
      code,
      env.github.clientId,
      env.github.clientSecret
    );

    const githubUser = await getGitHubUser(accessToken);

    let user = await User.findOne({ githubId: String(githubUser.id) });

    if (user) {
      user.accessToken = accessToken;
      user.username = githubUser.login;
      user.avatar = githubUser.avatar_url;
      user.email = githubUser.email;
      await user.save();
    } else {
      user = await User.create({
        githubId: String(githubUser.id),
        username: githubUser.login,
        avatar: githubUser.avatar_url,
        email: githubUser.email,
        accessToken,
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        email: user.email,
        plan: user.plan,
        generationsThisMonth: user.generationsThisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  const user = req.user;
  user.resetMonthlyCountIfNeeded();
  await user.save();

  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      avatar: user.avatar,
      email: user.email,
      plan: user.plan,
      generationsThisMonth: user.generationsThisMonth,
      generationsLimit: user.plan === 'pro' ? null : 5,
      createdAt: user.createdAt,
    },
  });
};

export const upgradePlan = async (req, res) => {
  const user = req.user;
  user.plan = 'pro';
  await user.save();

  res.json({
    success: true,
    message: 'Upgraded to Pro plan successfully',
    user: {
      id: user._id,
      plan: user.plan,
    },
  });
};
