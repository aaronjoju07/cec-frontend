'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="p-6 bg-gray-50 shadow-md rounded-md">
      <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      <p className="text-gray-700 mt-2">View and edit your profile information.</p>
      <div className="mt-4">
        <p className="text-gray-800"><strong>Username:</strong> {user?.username}</p>
        <p className="text-gray-800"><strong>Email:</strong> {user?.email}</p>
        <p className="text-gray-800"><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  );
}