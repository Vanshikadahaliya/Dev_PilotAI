import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db.js';
import { env } from '../../../../lib/env.js';
import User from '../../../../lib/models/User.js';
import { exchangeCodeForToken, getGitHubUser } from '../../../../lib/github.js';
import { generateToken } from '../../../../lib/auth.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

const upsertGithubUser = async (githubUser, accessToken) => {
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

  return user;
};

export async function GET() {
  const state = crypto.randomBytes(16).toString('hex');
  const params = new URLSearchParams({
    client_id: env.github.clientId,
    redirect_uri: env.github.callbackUrl,
    scope: 'read:user user:email repo',
    state,
  });

  const response = NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`);
  response.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.nodeEnv === 'production',
    maxAge: 5 * 60,
    path: '/',
  });
  return response;
}

export async function POST(request) {
  try {
    await connectDB();
    const { code } = await request.json();

    if (!code) {
      return errorResponse('Authorization code required', 400);
    }

    const accessToken = await exchangeCodeForToken(code, env.github.clientId, env.github.clientSecret);
    const githubUser = await getGitHubUser(accessToken);
    const user = await upsertGithubUser(githubUser, accessToken);
    const token = generateToken(user._id);

    return json({
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
    return errorResponse(error.message, 500);
  }
}
