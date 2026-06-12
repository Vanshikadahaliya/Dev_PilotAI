import { Star, GitFork, Code2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from './ui/Badge';

export default function RepoCard({ repo, onClick, selected }) {
  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={() => onClick?.(repo)}
      className={`bg-surface border rounded-xl p-5 cursor-pointer transition-all ${
        selected ? 'border-primary ring-2 ring-primary/30' : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-text truncate pr-2">{repo.repoName || repo.fullName}</h3>
        {repo.language && <Badge color="primary">{repo.language}</Badge>}
      </div>

      <p className="text-sm text-text-muted line-clamp-2 mb-4 min-h-[40px]">
        {repo.description || 'No description available'}
      </p>

      <div className="flex items-center gap-4 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5" />
          {repo.stars ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="w-3.5 h-3.5" />
          {repo.forks ?? 0}
        </span>
        <span className="flex items-center gap-1">
          <Code2 className="w-3.5 h-3.5" />
          {repo.language || 'N/A'}
        </span>
        <span className="flex items-center gap-1 ml-auto">
          <Clock className="w-3.5 h-3.5" />
          {formatDate(repo.updatedAt)}
        </span>
      </div>
    </motion.div>
  );
}
