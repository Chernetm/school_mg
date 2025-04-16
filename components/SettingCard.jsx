'use client';

import SettingsForm from '@/components/Setting';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [isAdmin, setIsAdmin] = useState(null); // 'null' means loading
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth', { credentials: 'include' });
        const data = await res.json();

        if (data.authenticated && data.user) {
          setIsAdmin(true); // Authenticated user
        } else {
          setIsAdmin(false); // Not authenticated
        }
      } catch {
        setIsAdmin(false); // On error, assume user is not authenticated
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      router.push('/');
    }
  }, [isAdmin, router]);

  // Show loading state until we know if the user is authenticated or not
  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  // Only render SettingsForm if the user is authenticated and allowed to access the page
  if (isAdmin === true) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <SettingsForm />
      </div>
    );
  }

  return null; // Return null to avoid showing content if the user is not authenticated
}
