import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    githubId: { type: Number, required: true },
    repoName: { type: String, required: true },
    fullName: { type: String, required: true },
    description: { type: String, default: '' },
    language: { type: String, default: '' },
    stars: { type: Number, default: 0 },
    forks: { type: Number, default: 0 },
    url: { type: String },
    updatedAt: { type: Date },
    defaultBranch: { type: String, default: 'main' },
  },
  { timestamps: true }
);

repositorySchema.index({ userId: 1, githubId: 1 }, { unique: true });

export default mongoose.models.Repository || mongoose.model('Repository', repositorySchema);
