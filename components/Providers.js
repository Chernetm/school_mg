
'use client';

import useInactivityLogout from '@/hooks/useInactivityLogout';
import { SessionProvider, useSession } from 'next-auth/react';

function InactivityWrapper({ children }) {
  const { data: session, status } = useSession();

  // Call the hook unconditionally, but only start the timer if the user is authenticated
  useInactivityLogout(status === 'authenticated' ? 15 : null); // Only start timer for authenticated users

  return children;
}

export function Providers({ children }) {
  return (
    <SessionProvider>
      <InactivityWrapper>
        {children}
      </InactivityWrapper>
    </SessionProvider>
  );
}
