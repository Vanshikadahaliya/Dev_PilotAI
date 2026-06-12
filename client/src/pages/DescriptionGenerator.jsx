import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useRepositories } from '../hooks/useRepositories';
import { aiAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import RepoCard from '../components/RepoCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const descriptionTypes = [
  { key: 'short', label: 'Short Description', desc: 'Elevator pitch (160 chars)' },
  { key: 'medium', label: 'Medium Description', desc: 'GitHub / portfolio style' },
  { key: 'linkedin', label: 'LinkedIn', desc: 'Professional post style' },
  { key: 'resume', label: 'Resume', desc: 'Bullet-point format' },
];

export default function DescriptionGenerator() {
  const { repos, loading: reposLoading } = useRepositories();
  const { refreshUser } = useAuth();
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [descriptions, setDescriptions] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleGenerate = async () => {
    if (!selectedRepo) {
      toast.error('Please select a repository');
      return;
    }

    setGenerating(true);
    setDescriptions(null);
    try {
      const { data } = await aiAPI.generateDescription(selectedRepo._id);
      setDescriptions(data.descriptions);
      refreshUser();
      toast.success('Descriptions generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async (key, text) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Sparkles className="w-6 h-6 text-secondary" />
          <h1 className="text-2xl font-bold">Project Description Generator</h1>
        </div>
        <p className="text-text-muted text-sm">
          Generate descriptions for different platforms and contexts
        </p>
      </motion.div>

      {reposLoading ? (
        <LoadingSpinner className="py-12" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[350px] overflow-y-auto pr-2">
            {repos.map((repo) => (
              <RepoCard
                key={repo._id}
                repo={repo}
                selected={selectedRepo?._id === repo._id}
                onClick={setSelectedRepo}
              />
            ))}
          </div>

          <Button onClick={handleGenerate} loading={generating} disabled={!selectedRepo}>
            <Sparkles className="w-4 h-4" />
            Generate Descriptions
          </Button>
        </>
      )}

      {generating && <LoadingSpinner className="py-12" size="lg" />}

      {descriptions && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {descriptionTypes.map((type) => (
            <Card key={type.key}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{type.label}</h3>
                  <p className="text-xs text-text-muted">{type.desc}</p>
                </div>
                <button
                  onClick={() => handleCopy(type.key, descriptions[type.key])}
                  className="p-2 rounded-lg hover:bg-surface-hover text-text-muted hover:text-text"
                >
                  {copiedKey === type.key ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-sm text-text-muted whitespace-pre-wrap">
                {descriptions[type.key]}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
