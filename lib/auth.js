import jwt from 'jsonwebtoken';
import User from './models/User.js';
import { env } from './env.js';
import { connectDB } from './db.js';

export const generateToken = (id) => jwt.sign({ id }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const getTokenFromRequest = (request) => {
  const authorization = request.headers.get('authorization');
  if (authorization?.startsWith('Bearer ')) {
    return authorization.split(' ')[1];
  }
  return null;
};

export const protectRequest = async (request) => {
  await connectDB();

  const token = getTokenFromRequest(request);
  if (!token) {
    throw new Error('Not authorized, no token');
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await User.findById(decoded.id);

  if (!user) {
    throw new Error('User not found. Re-authenticate to create/update your user.');
  }

  return user;
};
