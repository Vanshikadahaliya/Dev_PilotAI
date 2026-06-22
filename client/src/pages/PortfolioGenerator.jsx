import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Download, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function PortfolioGenerator() {
  const { user, refreshUser } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    setPortfolio(null);
    try {
      const { data } = await aiAPI.generatePortfolio();
      setPortfolio(data.portfolio);
      refreshUser();
      toast.success('Portfolio generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!portfolio?.html) return;
    const blob = new Blob([portfolio.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${user?.username || 'portfolio'}-portfolio.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Portfolio downloaded!');
  };

  if (user?.plan !== 'pro') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Crown className="w-12 h-12 text-secondary mb-4" />
        <h2 className="text-xl font-bold mb-2">Pro Feature</h2>
        <p className="text-text-muted mb-6 max-w-md">
          Portfolio Builder is available on the Pro plan. Upgrade to generate and export portfolio websites.
        </p>
        <Link to="/dashboard">
          <Button>Upgrade to Pro</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Globe className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold">Portfolio Generator</h1>
        </div>
        <p className="text-text-muted text-sm">Generate a complete portfolio website from your GitHub profile</p>
      </motion.div>

      <Button onClick={handleGenerate} loading={generating} size="lg">
        <Globe className="w-4 h-4" />
        Generate Portfolio
      </Button>

      {generating && (
        <div className="flex flex-col items-center py-12 gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-text-muted">Building your portfolio...</p>
        </div>
      )}

      {portfolio && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          {portfolio.skills && (
            <Card>
              <h3 className="font-medium mb-3">Detected Skills</h3>
              <div className="flex flex-wrap gap-2">
                {portfolio.skills.map((skill) => (
                  <Badge key={skill} color="default">{skill}</Badge>
                ))}
              </div>
            </Card>
          )}

          {portfolio.projects && (
            <Card>
              <h3 className="font-semibold mb-3">Projects</h3>
              <div className="space-y-3">
                {portfolio.projects.map((project, i) => (
                  <div key={i} className="border-b border-border pb-3 last:border-0">
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-text-muted">{project.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4" /> Export HTML
            </Button>
          </div>

          {portfolio.html && (
            <Card className="!p-0 overflow-hidden">
              <iframe
                srcDoc={portfolio.html}
                title="Portfolio Preview"
                className="w-full h-[600px] border-0"
                sandbox="allow-scripts"
              />
            </Card>
          )}
        </motion.div>
      )}
    </div>
  );
}
