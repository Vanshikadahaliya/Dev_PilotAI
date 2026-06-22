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
      whileHover={{ y: -4 }}
      onClick={() => onClick?.(repo)}
      className={`bg-transparent border rounded-xl p-5 cursor-pointer transition-all ${
        selected ? 'border-primary ring-1 ring-primary/20 bg-surface/5' : 'border-border hover:shadow-sm hover:bg-surface/5'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-text truncate pr-2">{repo.repoName || repo.fullName}</h3>
        {repo.language && <Badge color="default">{repo.language}</Badge>}
      </div>

      <p className="text-sm text-text-muted line-clamp-2 mb-4 min-h-[36px]">
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
