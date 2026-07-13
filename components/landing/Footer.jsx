"use client";

import { Zap, Code2, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md flex items-center justify-center bg-primary text-white">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">DevPilot AI</span>
        </div>

        <div className="text-sm text-text-muted">
          &copy; {new Date().getFullYear()} DevPilot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
