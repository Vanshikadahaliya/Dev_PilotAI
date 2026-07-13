"use client";

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  return context || {
    user: null,
    loading: true,
    login: () => {},
    logout: () => {},
    upgradePlan: async () => {},
    refreshUser: () => {},
  };
}
