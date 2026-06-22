import { useState } from 'react';
import { motion } from 'framer-motion';
import { GitPullRequest, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Textarea from '../components/ui/Textarea';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PRSummarizer() {
  const { user, refreshUser } = useAuth();
  const [prDescription, setPrDescription] = useState('');
  const [changedFiles, setChangedFiles] = useState('');
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prDescription && !changedFiles) {
      toast.error('Provide a PR description or changed files');
      return;
    }

    setLoading(true);
    setSummary(null);
    try {
      const files = changedFiles.split('\n').filter(Boolean);
      const { data } = await aiAPI.summarizePR({ prDescription, changedFiles: files });
      setSummary(data.summary);
      refreshUser();
      toast.success('PR summarized!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Summarization failed');
    } finally {
      setLoading(false);
    }
  };

  if (user?.plan !== 'pro') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Crown className="w-12 h-12 text-secondary mb-4" />
        <h2 className="text-xl font-bold mb-2">Pro Feature</h2>
        <p className="text-text-muted mb-6 max-w-md">
          PR Summarizer is available on the Pro plan.
        </p>
        <Link to="/dashboard"><Button>Upgrade to Pro</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <GitPullRequest className="w-6 h-6 text-secondary" />
          <h1 className="text-2xl font-semibold">PR Summarizer</h1>
        </div>
        <p className="text-text-muted text-sm">Get AI-powered summaries of pull request changes</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Textarea
          label="PR Description"
          placeholder="Paste the pull request description here..."
          value={prDescription}
          onChange={(e) => setPrDescription(e.target.value)}
          className="min-h-[200px]"
        />
        <Textarea
          label="Changed Files (one per line)"
          placeholder="src/components/Button.jsx&#10;src/utils/api.js&#10;package.json"
          value={changedFiles}
          onChange={(e) => setChangedFiles(e.target.value)}
          className="min-h-[200px]"
        />
      </div>

      <Button onClick={handleSubmit} loading={loading} variant="primary">
        Summarize Pull Request
      </Button>

      {loading && <LoadingSpinner className="py-12" size="lg" />}

      {summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="lg:col-span-2">
            <h3 className="font-semibold mb-2">Executive Summary</h3>
            <p className="text-sm text-text-muted">{summary.executiveSummary}</p>
          </Card>
          <Card>
            <h3 className="font-semibold mb-3 text-green-400">Key Changes</h3>
            <ul className="space-y-2">
              {summary.keyChanges?.map((c, i) => (
                <li key={i} className="text-sm text-text-muted flex gap-2">
                  <span className="text-green-400">•</span> {c}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="font-semibold mb-3 text-yellow-400">Risks</h3>
            <ul className="space-y-2">
              {summary.risks?.map((r, i) => (
                <li key={i} className="text-sm text-text-muted flex gap-2">
                  <span className="text-yellow-400">•</span> {r}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="lg:col-span-2">
            <h3 className="font-semibold mb-3 text-primary">Suggested Improvements</h3>
            <ul className="space-y-2">
              {summary.improvements?.map((imp, i) => (
                <li key={i} className="text-sm text-text-muted flex gap-2">
                  <span className="text-primary">•</span> {imp}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}
    </div>
  );
}
