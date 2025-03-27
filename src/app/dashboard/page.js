'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-50">Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 shadow-lg rounded-md border border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-800">Welcome, {user?.username}!</h1>
      <p className="text-gray-700 mt-2">Manage your events and schedule here.</p>
    </div>
  );
}