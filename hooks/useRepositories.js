"use client";

import { useState, useEffect } from 'react';
import { reposAPI } from '../services/api';

export function useRepositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    reposAPI.getAll()
      .then(({ data }) => setRepos(data.repositories || []))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load repos'))
      .finally(() => setLoading(false));
  }, []);

  return { repos, loading, error };
}
