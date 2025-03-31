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

      // Update the events list by filtering out the deleted event
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

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">My Events</h1>
        <Link
          href="/dashboard/organizer/events/new"
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Create New Event
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-4 rounded-md shadow-md hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-medium text-gray-800">{event.name}</h2>
              <p className="text-gray-700">{event.description}</p>
              <div className="mt-4 flex space-x-4">
                <Link
                  href={`/dashboard/organizer/events/${event._id}`}
                  className="text-gray-700 hover:text-gray-900 hover:underline"
                >
                  View
                </Link>
                <Link
                  href={`/dashboard/organizer/events/${event._id}/edit`}
                  className="text-gray-700 hover:text-gray-900 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="text-red-600 hover:text-red-800 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}