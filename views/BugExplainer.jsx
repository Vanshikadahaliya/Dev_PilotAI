"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bug } from 'lucide-react';
import { aiAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Textarea from '../components/ui/Textarea';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function BugExplainer() {
  const { refreshUser } = useAuth();
  const [errorMessage, setErrorMessage] = useState('');
  const [stackTrace, setStackTrace] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!errorMessage.trim()) {
      toast.error('Please provide an error message');
      return;
    }

    setLoading(true);
    setExplanation(null);
    try {
      const { data } = await aiAPI.explainBug({ errorMessage, stackTrace });
      setExplanation(data.explanation);
      refreshUser();
      toast.success('Bug analyzed!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Bug className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-semibold">Bug Explainer</h1>
        </div>
        <p className="text-text-muted text-sm">Paste an error message and stack trace to get AI-powered debugging help</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Textarea
          label="Error Message"
          placeholder="TypeError: Cannot read properties of undefined (reading 'map')"
          value={errorMessage}
          onChange={(e) => setErrorMessage(e.target.value)}
        />
        <Textarea
          label="Stack Trace (optional)"
          placeholder="at Component.render (App.jsx:42:15)&#10;at renderWithHooks (react-dom.js:14985:18)"
          value={stackTrace}
          onChange={(e) => setStackTrace(e.target.value)}
          className="min-h-40 font-mono text-xs"
        />
      </div>

      <Button onClick={handleSubmit} loading={loading} variant="primary">
        <Bug className="w-4 h-4" />
        Explain Bug
      </Button>

      {loading && <LoadingSpinner className="py-12" size="lg" />}

      {explanation && (
        <div className="space-y-4">
          <Card>
            <h3 className="font-semibold mb-2 text-red-400">Root Cause</h3>
            <p className="text-sm text-text-muted">{explanation.rootCause}</p>
          </Card>

          <Card>
            <h3 className="font-semibold mb-2">Explanation</h3>
            <p className="text-sm text-text-muted whitespace-pre-wrap">{explanation.explanation}</p>
          </Card>

          <Card>
            <h3 className="font-semibold mb-3 text-primary">Fix Suggestions</h3>
            <ul className="space-y-2">
              {explanation.fixSuggestions?.map((fix, i) => (
                <li key={i} className="text-sm text-text-muted flex gap-2">
                  <span className="text-primary font-bold">{i + 1}.</span> {fix}
                </li>
              ))}
            </ul>
          </Card>

          {explanation.exampleSolution && (
            <Card>
              <h3 className="font-semibold mb-3">Example Solution</h3>
              <pre className="bg-background border border-border rounded-lg p-4 text-xs overflow-auto text-green-400 font-mono">
                {explanation.exampleSolution}
              </pre>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
