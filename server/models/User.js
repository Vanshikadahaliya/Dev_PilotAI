import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    githubId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    avatar: { type: String },
    email: { type: String },
    accessToken: { type: String, select: false },
    plan: {
      type: String,
      enum: ['free', 'pro'],
      default: 'free',
    },
    generationsThisMonth: { type: Number, default: 0 },
    generationResetDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.methods.canGenerate = function () {
  if (this.plan === 'pro') return true;
  return this.generationsThisMonth < 5;
};

userSchema.methods.resetMonthlyCountIfNeeded = function () {
  const now = new Date();
  const resetDate = new Date(this.generationResetDate);
  if (
    now.getMonth() !== resetDate.getMonth() ||
    now.getFullYear() !== resetDate.getFullYear()
  ) {
    this.generationsThisMonth = 0;
    this.generationResetDate = now;
  }
};

export default mongoose.model('User', userSchema);
