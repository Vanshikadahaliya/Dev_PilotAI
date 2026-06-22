import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Search } from 'lucide-react';
import { reposAPI } from '../services/api';
import RepoCard from '../components/RepoCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchRepos = async () => {
    try {
      const { data } = await reposAPI.getAll();
      setRepos(data.repositories || []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load repositories');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const { data } = await reposAPI.sync();
      setRepos(data.repositories || []);
      toast.success(`Synced ${data.count} repositories`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => { fetchRepos(); }, []);

  const filtered = repos.filter((r) =>
    r.repoName?.toLowerCase().includes(search.toLowerCase()) ||
    r.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold mb-1">Repositories</h1>
            <p className="text-text-muted text-sm">Connect and analyze your GitHub repositories</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                placeholder="Search repositories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-0"
              />
            </div>
            <Button onClick={handleSync} loading={syncing} variant="ghost">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <LoadingSpinner className="py-20" size="lg" />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-text-muted mb-4">
            {repos.length === 0 ? 'No repositories synced yet.' : 'No repositories match your search.'}
          </p>
          {repos.length === 0 && (
            <Button onClick={handleSync} loading={syncing}>Sync Repositories</Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((repo) => (
            <RepoCard key={repo._id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
}
