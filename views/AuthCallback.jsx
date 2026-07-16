"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

export default function AuthCallback() {
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('token');

    // Defensive: if callback arrives without token, avoid throwing during login flow
    if (!token) {
      toast.error('Authentication failed');
      router.replace('/login?error=auth_failed');
      return;
    }

    // Defensive: avoid unhandled errors bubbling into Next error UI
    try {
      login(token);
      toast.success('Welcome to DevPilot AI!');
      router.replace('/dashboard');
    } catch (e) {
      toast.error('Authentication failed');
      router.replace('/login?error=auth_failed');
    }
  }, [login, router]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4">
      <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-text-muted">Completing sign in...</p>
      </div>
    </div>
  );
}
