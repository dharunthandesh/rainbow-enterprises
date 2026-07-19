'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/useAuth';

/**
 * AuthProvider
 *
 * A lightweight client component that must live inside the root layout.
 * It calls `initialize()` once on mount so that:
 *   1. `getSession()` restores any existing session from cookies/localStorage.
 *   2. `onAuthStateChange()` keeps the Zustand store in sync for the lifetime
 *      of the tab (handles SIGNED_IN fired after the /auth/callback redirect).
 *
 * This component renders nothing — it only wires up the auth side-effect.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuth.getState().initialize();
  }, []);

  return <>{children}</>;
}
