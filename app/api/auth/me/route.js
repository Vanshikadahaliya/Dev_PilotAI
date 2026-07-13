import { connectDB } from '../../../../lib/db.js';
import { protectRequest } from '../../../../lib/auth.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

export async function GET(request) {
  try {
    await connectDB();
    const user = await protectRequest(request);

    user.resetMonthlyCountIfNeeded();
    await user.save();

    return json({
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
  } catch (error) {
    return errorResponse(error.message, 401);
  }
}
