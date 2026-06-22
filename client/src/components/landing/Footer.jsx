import { Link } from 'react-router-dom';
import { Zap, Code2, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded flex items-center justify-center bg-transparent border border-border">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="text-sm">DevPilot</span>
        </div>

        <div className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} DevPilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
