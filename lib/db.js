import mongoose from 'mongoose';
import { env } from './env.js';

const globalForMongoose = globalThis;

if (!globalForMongoose.__devpilotMongoose) {
  globalForMongoose.__devpilotMongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (!env.mongodbUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  const cached = globalForMongoose.__devpilotMongoose;

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(env.mongodbUri).then((conn) => conn);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
