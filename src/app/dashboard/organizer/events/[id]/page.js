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

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!event) return <div className="p-6 text-center">Event not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">{event.name}</h1>
      <div className="bg-white p-6 rounded-md shadow-md">
        <p className="text-gray-600">{event.description}</p>
        <p className="mt-2">
          <strong>Start:</strong> {new Date(event.conductedDates.start).toLocaleString()}
        </p>
        <p>
          <strong>End:</strong> {new Date(event.conductedDates.end).toLocaleString()}
        </p>
        <p>
          <strong>Max Students:</strong> {event.maximumStudents}
        </p>
        <h3 className="mt-4 font-medium">Registered Students ({event.registeredStudents.length})</h3>
        <ul className="mt-2 space-y-1">
          {event.registeredStudents.map((student) => (
            <li key={student._id} className="text-gray-700">{student.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}