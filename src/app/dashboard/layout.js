// app/dashboard/student/layout.js
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import Chatbot from '@/components/Chatbot';

export default function StudentLayout({ children }) {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth || auth.loading) return;
    if (!auth.isAuthenticated || auth.user?.role !== 'student') {
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



  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={auth.user} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar user={auth.user} />
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-1 text-gray-800">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}