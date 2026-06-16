import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { env } from '../config/env.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, env.jwtSecret);

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        console.warn(`[Auth] JWT valid but no user found for id=${decoded.id}`);
        return res.status(401).json({
          success: false,
          message:
            'User not found. Token appears valid but the user record is missing. Re-authenticate to create/update your user.',
        });
      }

      req.user = user;
      next();
    } catch (dbErr) {
      console.error('[Auth] Error fetching user by id from DB', dbErr);
      return res.status(500).json({ success: false, message: 'Server error while verifying user' });
    }
  } catch (error) {
    console.warn('[Auth] Token verification failed:', error.message);
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
  }
};

export const requirePro = (req, res, next) => {
  if (req.user.plan !== 'pro') {
    return res.status(403).json({
      success: false,
      message: 'This feature requires a Pro plan. Upgrade to unlock unlimited generations.',
    });
  }
  next();
};
