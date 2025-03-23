'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({ children }) {
  const auth = useAuth(); // Prevent undefined destructuring
  const router = useRouter();

  useEffect(() => {
    if (!auth || auth.loading) return; // Avoid running redirect on undefined
    if (!auth.isAuthenticated) {
      router.push('/login');
    }
  }, [auth, router]);

  if (!auth || auth.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar user={auth.user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar user={auth.user} />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
