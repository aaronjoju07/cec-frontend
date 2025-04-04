'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/organizer/my-events`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(res.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
      alert('Event deleted successfully!');
    } catch (error) {
      console.error('Error deleting event:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to delete event'}`);
      } else if (error.request) {
        alert('Error: No response from server. Please check your network.');
      } else {
        alert('Error: An unexpected error occurred.');
      }
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">My Events</h1>
        <div className="flex justify-between items-center mb-8">
          <div></div> {/* Placeholder for alignment */}
          <Link
            href="/dashboard/organizer/events/new"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Create New Event
          </Link>
        </div>
        {loading ? (
          <div className="text-center text-gray-600 text-lg">
            <svg
              className="animate-spin h-6 w-6 mx-auto mb-2 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
              />
            </svg>
            Loading...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{event.name}</h2>
                <div className="flex justify-between text-sm text-gray-600 mb-6">
                  <div>
                    <p className="font-medium">Start time</p>
                    <p>{formatDateTime(event.conductedDates.start)}</p>
                  </div>
                  <div>
                    <p className="font-medium">End time</p>
                    <p>{formatDateTime(event.conductedDates.end)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href={`/dashboard/organizer/events/${event._id}`}
                    className="bg-indigo-100 text-indigo-700 text-center py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                  >
                    View
                  </Link>
                  <Link
                    href={`/dashboard/organizer/events/${event._id}/edit`}
                    className="bg-indigo-100 text-indigo-700 text-center py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/dashboard/organizer/subevents?eventId=${event._id}`}
                    className="bg-indigo-100 text-indigo-700 text-center py-2 rounded-lg font-medium hover:bg-indigo-200 transition-colors"
                  >
                    Manage Events
                  </Link>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-100 text-red-700 text-center py-2 rounded-lg font-medium hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}