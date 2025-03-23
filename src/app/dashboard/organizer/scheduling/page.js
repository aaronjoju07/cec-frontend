'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SchedulingPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/scheduling/schedule`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(res.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeSchedule = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scheduling/optimize`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setEvents(res.data.schedule);
    } catch (error) {
      console.error('Error optimizing schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Event Scheduling</h1>
        <button
          onClick={handleOptimizeSchedule}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? 'Optimizing...' : 'Optimize Schedule'}
        </button>
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event._id} className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-medium">{event.name}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm mt-2">
                <strong>Start:</strong> {new Date(event.conductedDates.start).toLocaleString()}
              </p>
              <p className="text-sm">
                <strong>End:</strong> {new Date(event.conductedDates.end).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}