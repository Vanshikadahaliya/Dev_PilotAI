import mongoose from 'mongoose';

const generationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['readme', 'description', 'portfolio', 'pr-summary', 'bug-explain'],
      required: true,
    },
    prompt: { type: String, required: true },
    response: { type: mongoose.Schema.Types.Mixed, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

generationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Generation', generationSchema);
