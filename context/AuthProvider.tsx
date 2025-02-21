'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import FloatingAIChat from '@/components/FloatingAIChat';

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <FloatingAIChat />
    </SessionProvider>
  );
}
