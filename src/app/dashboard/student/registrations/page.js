'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState({ upcomingEvents: [], pastEvents: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/registrations/my-registrations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRegistrations(res.data);
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (registrationId) => {
    if (confirm('Are you sure you want to cancel this registration?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/registrations/${registrationId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchRegistrations();
      } catch (error) {
        console.error('Error cancelling registration:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">My Registrations</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <h2 className="text-xl font-medium mb-4">Upcoming Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {registrations.upcomingEvents.map((reg) => (
              <div key={reg._id} className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-medium">{reg.event.name}</h3>
                <p className="text-gray-600">{reg.event.description}</p>
                <p className="text-sm mt-2">
                  <strong>Start:</strong> {new Date(reg.event.conductedDates.start).toLocaleString()}
                </p>
                <button
                  onClick={() => handleCancel(reg._id)}
                  className="text-red-600 hover:underline mt-2"
                >
                  Cancel Registration
                </button>
              </div>
            ))}
          </div>
          <h2 className="text-xl font-medium mb-4">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrations.pastEvents.map((reg) => (
              <div key={reg._id} className="bg-white p-4 rounded-md shadow-md">
                <h3 className="text-lg font-medium">{reg.event.name}</h3>
                <p className="text-gray-600">{reg.event.description}</p>
                <p className="text-sm mt-2">
                  <strong>End:</strong> {new Date(reg.event.conductedDates.end).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}