'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { 
  HomeIcon, 
  CalendarIcon, 
  UserIcon, 
  ChartBarIcon, 
  ClockIcon, 
  InboxIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Define navigation items based on user role
  const navigation = user?.role === 'organizer'
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'My Events', href: '/dashboard/organizer/events', icon: CalendarIcon },
        { name: 'Create Event', href: '/dashboard/organizer/events/new', icon: InboxIcon },
        { name: 'Analytics', href: '/dashboard/organizer/analytics', icon: ChartBarIcon },
        { name: 'Score Management', href: '/dashboard/organizer/subevents', icon: TrophyIcon },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Discover Events', href: '/dashboard/student/events', icon: CalendarIcon },
        { name: 'My Registrations', href: '/dashboard/student/registrations', icon: InboxIcon },
        // { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
      ];

  // Handle modal open/close
  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <span className="text-white text-xl font-semibold">
                Campus Events
              </span>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md
                      ${isActive 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 flex-shrink-0 h-6 w-6
                        ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}
                      `}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-700 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center cursor-pointer" onClick={openProfileModal}>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white hover:underline">{user?.username}</p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200 hover:underline">
                    {user?.role === 'organizer' ? 'Organizer' : 'Student'}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="mt-3 text-sm text-gray-400 hover:text-white w-full text-left"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-gray-50 bg-opacity-50 flex items-center justify-center z-50" onClick={closeProfileModal}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
              <button
                onClick={closeProfileModal}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-800 text-lg"><strong className="text-gray-900">Username:</strong> {user?.username || 'N/A'}</p>
              <p className="text-gray-800 text-lg"><strong className="text-gray-900">Email:</strong> {user?.email || 'N/A'}</p>
              <p className="text-gray-800 text-lg"><strong className="text-gray-900">Role:</strong> {user?.role || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}