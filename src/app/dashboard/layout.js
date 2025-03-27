'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({ children }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth || auth.loading) return;
    if (!auth.isAuthenticated) {
      router.push('/login');
    }
  }, [auth, router]);

  if (!auth || auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={auth.user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar user={auth.user} />
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-6 text-gray-800">
          {children}
        </main>
      </div>
    </div>
  );
}
