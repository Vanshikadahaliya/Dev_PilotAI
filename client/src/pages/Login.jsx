import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function Login() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'auth_failed') toast.error('GitHub authentication failed. Please try again.');
    if (error === 'no_code') toast.error('Authorization was cancelled.');
  }, [searchParams]);

  const handleGitHubLogin = () => {
    authAPI.githubLogin();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary text-white">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-base brand">DevPilot AI</span>
          </Link>
          <h1 className="text-2xl font-semibold mb-2">Sign in to DevPilot</h1>
          <p className="text-text-muted">Connect your GitHub account to sync repositories</p>
        </div>

        <div className="bg-surface border border-border rounded-md p-8 space-y-6 shadow-sm">
          <Button
            onClick={handleGitHubLogin}
            className="w-full bg-[#24292f] hover:bg-[#1f2328] text-white"
            size="lg"
          >
            <Code2 className="w-5 h-5" />
            Continue with GitHub
          </Button>

          <p className="text-xs text-center text-text-muted">
            We only request read access to your repositories.
          </p>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          <Link to="/" className="hover:text-text transition-colors">
            &larr; Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
