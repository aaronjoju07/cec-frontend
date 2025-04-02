'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SchedulingPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch upcoming events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/scheduling/schedule`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(response.data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events. Please try again.');
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeSchedule = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scheduling/optimize`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setEvents(response.data.schedule || []);
      alert('Schedule optimized successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to optimize schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Event Scheduling</h1>
        <button
          onClick={handleOptimizeSchedule}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Optimizing...' : 'Optimize Schedule'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : events.length === 0 ? (
        <div className="text-center text-gray-700">No upcoming events to schedule.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white p-4 rounded-md shadow-md border border-gray-200"
            >
              <h2 className="text-lg font-medium text-gray-800">{event.name}</h2>
              <p className="text-gray-700">{event.description}</p>
              <p className="text-sm mt-2 text-gray-600">
                <strong className="text-gray-800">Start:</strong>{' '}
                {new Date(event.conductedDates.start).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-800">End:</strong>{' '}
                {new Date(event.conductedDates.end).toLocaleString()}
              </p>
              {event.scheduledTimeSlot && (
                <p className="text-sm text-gray-600">
                  <strong className="text-gray-800">Optimized Slot:</strong>{' '}
                  {new Date(event.scheduledTimeSlot.start).toLocaleString()} -{' '}
                  {new Date(event.scheduledTimeSlot.end).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}