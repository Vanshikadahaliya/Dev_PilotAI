import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Menu, X, Sun, Moon } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

const links = [
  { href: '#features', label: 'Features' },
  { href: '#how-it-works', label: 'How it Works' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#faq', label: 'FAQ' },
];

export default function Navbar() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  useTheme();

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary text-white">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-base brand">DevPilot AI</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-text-muted hover:text-text transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button variant="outline" size="sm">Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link to="/login">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2 text-text-muted" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden border-t border-border bg-surface">
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-end">
                <ThemeToggle />
              </div>
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="block text-sm text-text-muted hover:text-text py-2">
                  {link.label}
                </a>
              ))}
              <Link to={user ? '/dashboard' : '/login'} onClick={() => setOpen(false)}>
                <Button className="w-full">{user ? 'Dashboard' : 'Get Started'}</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme" className="p-2 rounded-md border border-border text-text-muted hover:text-text hover:bg-surface-hover transition-colors">
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
}
