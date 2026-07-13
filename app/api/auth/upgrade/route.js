import { connectDB } from '../../../../lib/db.js';
import { protectRequest } from '../../../../lib/auth.js';
import { errorResponse, json } from '../../../../lib/response.js';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    await connectDB();
    const user = await protectRequest(request);

    user.plan = 'pro';
    await user.save();

    return json({
      success: true,
      message: 'Upgraded to Pro plan successfully',
      user: {
        id: user._id,
        plan: user.plan,
      },
    });
  } catch (error) {
    return errorResponse(error.message, 401);
  }
}
