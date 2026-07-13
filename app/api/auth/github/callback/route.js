import { NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db.js';
import { env } from '../../../../../lib/env.js';
import User from '../../../../../lib/models/User.js';
import { exchangeCodeForToken, getGitHubUser } from '../../../../../lib/github.js';
import { generateToken } from '../../../../../lib/auth.js';

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

export async function GET(request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const cookieState = request.cookies.get('oauth_state')?.value;

    if (!state || !cookieState || state !== cookieState) {
      return NextResponse.redirect(new URL('/login?error=invalid_state', env.clientUrl));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=no_code', env.clientUrl));
    }

    const accessToken = await exchangeCodeForToken(code, env.github.clientId, env.github.clientSecret);
    const githubUser = await getGitHubUser(accessToken);
    const user = await upsertGithubUser(githubUser, accessToken);
    const token = generateToken(user._id);

    const response = NextResponse.redirect(new URL(`/auth/callback?token=${token}`, env.clientUrl));
    response.cookies.set('oauth_state', '', { path: '/', maxAge: 0 });
    return response;
  } catch (error) {
    return NextResponse.redirect(new URL('/login?error=auth_failed', env.clientUrl));
  }
}
