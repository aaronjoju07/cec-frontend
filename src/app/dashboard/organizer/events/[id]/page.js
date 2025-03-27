'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvent(res.data);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-800">Loading...</div>;
  if (!event) return <div className="p-6 text-center text-gray-800">Event not found</div>;

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6 text-gray-900">{event.name}</h1>
      <div className="bg-white p-6 rounded-md shadow-md border border-gray-200">
        <p className="text-gray-800">{event.description}</p>
        <p className="mt-2 text-gray-700">
          <strong>Start:</strong> {new Date(event.conductedDates.start).toLocaleString()}
        </p>
        <p className="text-gray-700">
          <strong>End:</strong> {new Date(event.conductedDates.end).toLocaleString()}
        </p>
        <p className="text-gray-700">
          <strong>Max Students:</strong> {event.maximumStudents}
        </p>
        <h3 className="mt-4 font-medium text-gray-900">Registered Students ({event.registeredStudents.length})</h3>
        <ul className="mt-2 space-y-1">
          {event.registeredStudents.map((student) => (
            <li key={student._id} className="text-gray-700 bg-gray-50 p-2 rounded">{student.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}