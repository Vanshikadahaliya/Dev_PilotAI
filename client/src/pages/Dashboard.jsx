import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, FolderGit2, Globe, GitPullRequest, Bug, Sparkles,
  ArrowRight, Crown, Zap,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { aiAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const tools = [
  { to: '/dashboard/readme', icon: FileText, label: 'README Generator', iconClass: 'text-primary', bgClass: 'bg-primary/15' },
  { to: '/dashboard/description', icon: Sparkles, label: 'Descriptions', iconClass: 'text-secondary', bgClass: 'bg-secondary/15' },
  { to: '/dashboard/portfolio', icon: Globe, label: 'Portfolio', iconClass: 'text-primary', bgClass: 'bg-primary/15', pro: true },
  { to: '/dashboard/pr-summary', icon: GitPullRequest, label: 'PR Summarizer', iconClass: 'text-secondary', bgClass: 'bg-secondary/15', pro: true },
  { to: '/dashboard/bug-explainer', icon: Bug, label: 'Bug Explainer', iconClass: 'text-primary', bgClass: 'bg-primary/15' },
  { to: '/dashboard/repos', icon: FolderGit2, label: 'Repositories', iconClass: 'text-secondary', bgClass: 'bg-secondary/15' },
];

export default function Dashboard() {
  const { user, upgradePlan } = useAuth();
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    aiAPI.getGenerations()
      .then(({ data }) => setGenerations(data.generations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async () => {
    try {
      await upgradePlan();
      toast.success('Upgraded to Pro!');
    } catch {
      toast.error('Upgrade failed');
    }
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Welcome back, {user?.username}
        </h1>
        <p className="text-text-muted">
          Your AI-powered developer copilot is ready to help.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <p className="text-sm text-text-muted mb-1">Plan</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold capitalize">{user?.plan}</p>
            {user?.plan === 'pro' && <Crown className="w-5 h-5 text-secondary" />}
          </div>
        </Card>
        <Card>
          <p className="text-sm text-text-muted mb-1">Generations This Month</p>
          <p className="text-2xl font-bold">
            {user?.plan === 'pro' ? '∞' : `${user?.generationsThisMonth || 0} / 5`}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-text-muted mb-1">Total Generations</p>
          <p className="text-2xl font-bold">{generations.length}</p>
        </Card>
      </div>

      {user?.plan !== 'pro' && (
        <Card className="border-primary/30 bg-primary/5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Upgrade to Pro</p>
                <p className="text-sm text-text-muted">Unlimited generations, Portfolio Builder, and PR Summaries</p>
              </div>
            </div>
            <Button onClick={handleUpgrade} size="sm">
              <Crown className="w-4 h-4" /> Upgrade — $12/mo
            </Button>
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link key={tool.to} to={tool.to}>
              <Card hover className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${tool.bgClass} flex items-center justify-center`}>
                  <tool.icon className={`w-5 h-5 ${tool.iconClass}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{tool.label}</p>
                  {tool.pro && user?.plan !== 'pro' && (
                    <Badge color="secondary" className="mt-1 text-[10px]">PRO</Badge>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted" />
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Generations */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Generations</h2>
        {loading ? (
          <LoadingSpinner className="py-8" />
        ) : generations.length === 0 ? (
          <Card>
            <p className="text-text-muted text-center py-4">
              No generations yet. Start by syncing your repositories!
            </p>
          </Card>
        ) : (
          <div className="space-y-2">
            {generations.slice(0, 5).map((gen) => (
              <Card key={gen._id} className="!p-4 flex items-center justify-between">
                <div>
                  <Badge color="primary" className="capitalize">{gen.type.replace('-', ' ')}</Badge>
                  <p className="text-xs text-text-muted mt-1">
                    {new Date(gen.createdAt).toLocaleString()}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
