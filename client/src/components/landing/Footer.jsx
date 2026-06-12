import { Link } from 'react-router-dom';
import { Zap, Code2, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">DevPilot AI</span>
            </div>
            <p className="text-sm text-text-muted">
              AI-powered developer copilot for READMEs, portfolios, and more.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="#features" className="hover:text-text">Features</a></li>
              <li><a href="#pricing" className="hover:text-text">Pricing</a></li>
              <li><Link to="/login" className="hover:text-text">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li><a href="#faq" className="hover:text-text">FAQ</a></li>
              <li><a href="#how-it-works" className="hover:text-text">Documentation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-surface hover:bg-surface-hover text-text-muted hover:text-text">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-surface hover:bg-surface-hover text-text-muted hover:text-text">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center text-sm text-text-muted">
          &copy; {new Date().getFullYear()} DevPilot AI. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
