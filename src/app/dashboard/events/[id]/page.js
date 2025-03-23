'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export default function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();

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

  const handleRegister = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registrations`,
        { eventId: id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Successfully registered!');
      fetchEvent();
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Please try again.');
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!event) return <div className="p-6 text-center">Event not found</div>;

  const isStudent = user?.role === 'student';
  const isRegistered = event.registeredStudents.some((student) => student._id === user?._id);

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
        <p>
          <strong>Current Registrations:</strong> {event.registeredStudents.length}
        </p>
        {isStudent && (
          <button
            onClick={handleRegister}
            disabled={isRegistered || event.registeredStudents.length >= event.maximumStudents}
            className={`mt-4 px-4 py-2 rounded-md text-white ${
              isRegistered || event.registeredStudents.length >= event.maximumStudents
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isRegistered ? 'Already Registered' : 'Register Now'}
          </button>
        )}
      </div>
    </div>
  );
}