import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FolderGit2,
  FileText,
  Briefcase,
  Globe,
  GitPullRequest,
  Bug,
  LogOut,
  Menu,
  X,
  Zap,
  Crown,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Badge from '../components/ui/Badge';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/dashboard/repos', icon: FolderGit2, label: 'Repositories' },
  { to: '/dashboard/readme', icon: FileText, label: 'README Generator' },
  { to: '/dashboard/description', icon: Briefcase, label: 'Descriptions' },
  { to: '/dashboard/portfolio', icon: Globe, label: 'Portfolio', pro: true },
  { to: '/dashboard/pr-summary', icon: GitPullRequest, label: 'PR Summarizer', pro: true },
  { to: '/dashboard/bug-explainer', icon: Bug, label: 'Bug Explainer' },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center text-white">
            <Zap className="w-4 h-4" />
          </div>
          <span className="font-bold text-lg">DevPilot AI</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/15 text-primary'
                  : 'text-text-muted hover:text-text hover:bg-surface-hover'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{item.label}</span>
            {item.pro && user?.plan !== 'pro' && (
              <Badge color="secondary" className="text-[10px]">PRO</Badge>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-hover/50">
          <img
            src={user?.avatar}
            alt={user?.username}
            className="w-9 h-9 rounded-full ring-2 ring-primary/30"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <div className="flex items-center gap-1">
              {user?.plan === 'pro' ? (
                <Badge color="secondary"><Crown className="w-3 h-3 mr-1" />Pro</Badge>
              ) : (
                <Badge color="default">
                  {user?.generationsThisMonth || 0}/5 gens
                </Badge>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-surface text-text-muted hover:text-text transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-72 border-r border-border bg-surface flex-col fixed h-full">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 h-full w-72 bg-surface border-r border-border z-50 lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-1 text-text-muted"
              >
                <X className="w-5 h-5" />
              </button>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-72">
        <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur-sm px-4 py-3 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md border border-border text-text-muted hover:text-text hover:bg-surface-hover"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block text-sm text-text-muted">
              Workspace
            </div>
          </div>
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
