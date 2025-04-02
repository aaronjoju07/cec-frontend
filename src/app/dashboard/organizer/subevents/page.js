// app/dashboard/organizer/subevents/page.js
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function SubEventManagementPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventId) fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvent(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch event details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Sub-Event Management</h1>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>
      )}
      {loading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : !event ? (
        <div className="text-center text-gray-700">Event not found.</div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-medium text-gray-800">{event.name}</h2>
            <p className="text-gray-700">{event.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {event.subEvents.map((subEvent) => (
              <div key={subEvent._id} className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-medium text-gray-800">{subEvent.name}</h3>
                <p className="text-gray-700">{subEvent.overview || 'No overview'}</p>
                <Link
                  href={`/dashboard/organizer/subevents/${event._id}/${subEvent._id}`}
                  className="mt-2 inline-block text-gray-700 hover:text-gray-900 hover:underline"
                >
                  Manage Rounds & Scores
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}