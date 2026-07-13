"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Wand2 } from 'lucide-react';
import { useRepositories } from '../hooks/useRepositories';
import { aiAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import RepoCard from '../components/RepoCard';
import MarkdownOutput from '../components/MarkdownOutput';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function ReadmeGenerator() {
  const { repos, loading: reposLoading } = useRepositories();
  const { refreshUser } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [readme, setReadme] = useState('');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!selectedRepo) {
      toast.error('Please select a repository');
      return;
    }

    setGenerating(true);
    setReadme('');
    try {
      const { data } = await aiAPI.generateReadme(selectedRepo._id);
      setReadme(data.readme);
      refreshUser();
      toast.success('README generated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <FileText className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold">README Generator</h1>
        </div>
        <p className="text-text-muted text-sm">
          Select a repository and generate a professional README with AI
        </p>
      </motion.div>

      {reposLoading ? (
        <LoadingSpinner className="py-12" />
      ) : repos.length === 0 ? (
        <p className="text-text-muted text-center py-12">
          Sync your repositories first from the Repositories page.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-105 overflow-y-auto pr-2">
            {repos.map((repo) => (
              <RepoCard
                key={repo._id}
                repo={repo}
                selected={selectedRepo?._id === repo._id}
                onClick={setSelectedRepo}
              />
            ))}
          </div>

          <Button onClick={handleGenerate} loading={generating} disabled={!selectedRepo} size="lg">
            <Wand2 className="w-4 h-4" />
            {generating ? 'Generating README...' : 'Generate README'}
          </Button>
        </>
      )}

      {generating && (
        <div className="flex flex-col items-center py-12 gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-text-muted">Analyzing repository and generating README...</p>
        </div>
      )}

      {readme && !generating && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-lg font-semibold mb-4">Generated README</h2>
          <MarkdownOutput content={readme} filename={`${selectedRepo?.repoName || 'README'}.md`} />
        </motion.div>
      )}
    </div>
  );
}
