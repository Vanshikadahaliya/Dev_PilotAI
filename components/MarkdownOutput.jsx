"use client";

import { Copy, Download, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Button from './ui/Button';
import toast from 'react-hot-toast';

export default function MarkdownOutput({ content, filename = 'README.md' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded successfully!');
  };

  if (!content) return null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-4 h-4" />
          Download
        </Button>
      </div>
      <div className="bg-surface border border-border rounded-xl p-6 overflow-auto max-h-[600px] prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
      <details className="group">
        <summary className="text-sm text-text-muted cursor-pointer hover:text-text">
          View raw markdown
        </summary>
        <pre className="mt-2 bg-surface border border-border rounded-xl p-4 text-xs overflow-auto max-h-[300px] text-text-muted">
          {content}
        </pre>
      </details>
    </div>
  );
}
