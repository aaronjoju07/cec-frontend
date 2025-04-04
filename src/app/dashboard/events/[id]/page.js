// app/dashboard/events/[id]/view/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export default function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchEventAndScores();
    } else {
      setError('Please log in to view event details.');
      setLoading(false);
    }
  }, [id, user]);

  const fetchEventAndScores = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      // Fetch event details including rounds and times
      const eventRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvent(eventRes.data);

      // Check if the student is registered and fetch their scores
      const isRegistered = eventRes.data.registeredStudents.some((student) => student._id === user?._id);
      if (isRegistered) {
        try {
          const scoresRes = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/registrations/my-scores/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setScores(scoresRes.data);
        } catch (scoreError) {
          console.error('Scores fetch error:', scoreError.response?.data || scoreError.message);
          setScores([]); // Default to empty array if scores fetch fails
          setError('Failed to load your scores. Event details are still available.');
        }
      } else {
        setScores([]); // No scores if student isn't registered
      }
    } catch (eventError) {
      console.error('Event fetch error:', eventError.response?.data || eventError.message);
      setError(
        eventError.response?.data?.message ||
          'Failed to load event details. Please check the event ID or try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to register.');
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/registrations`,
        { eventId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Successfully registered!');
      fetchEventAndScores(); // Refresh data after registration
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="p-6 text-center text-gray-800">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchEventAndScores}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const isStudent = user?.role === 'student';
  const isRegistered = event?.registeredStudents.some((student) => student._id === user?._id);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">{event.name}</h1>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>
      )}

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-md shadow-md border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Overview</h2>
          <p className="text-gray-700">{event.description}</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700">
              <strong>Start:</strong> {new Date(event.conductedDates.start).toLocaleString()}
            </p>
            <p className="text-gray-700">
              <strong>End:</strong> {new Date(event.conductedDates.end).toLocaleString()}
            </p>
            <p className="text-gray-700">
              <strong>Maximum Students:</strong> {event.maximumStudents || 'Not specified'}
            </p>
            <p className="text-gray-700">
              <strong>Max Events Per Student:</strong> {event.maxEventsPerStudent || 'Not specified'}
            </p>
            <p className="text-gray-700">
              <strong>Current Registrations:</strong> {event.registeredStudents.length}
            </p>
          </div>
          {isStudent && (
            <button
              onClick={!isRegistered ? handleRegister : undefined} // Only trigger onClick if not registered
              disabled={isRegistered || event.registeredStudents.length >= event.maximumStudents}
              className={`mt-4 px-4 py-2 rounded-md text-white ${
                isRegistered || event.registeredStudents.length >= event.maximumStudents
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-600 hover:bg-gray-700'
              }`}
            >
              {isRegistered
                ? 'Registered' // Changed from 'Already Registered' to 'Registered'
                : event.registeredStudents.length >= event.maximumStudents
                ? 'Event Full'
                : 'Register Now'}
            </button>
          )}
        </section>
        <section className="bg-white p-6 rounded-md shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event Schedules</h2>
          {event.subEvents?.length > 0 ? (
            <div className="space-y-4">
              {event.subEvents.map((subEvent) => (
                <div key={subEvent._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="text-lg font-medium text-gray-800">{subEvent.name}</h3>
                  <p className="text-gray-700 mt-1">{subEvent.overview || 'No overview provided'}</p>
                  <p className="text-gray-700 mt-1">
                    <strong>Venue:</strong> {subEvent.venue || 'Not specified'}
                  </p>
                  <p className="text-gray-700 mt-1">
                    <strong>Time:</strong> {subEvent.time ? new Date(subEvent.time).toLocaleString() : 'Not specified'}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No sub-events available</p>
          )}
        </section>

        {isRegistered && (
          <section className="bg-white p-6 rounded-md shadow-md border border-gray-200">
            <h2 className="text-xl font-medium text-gray-800 mb-4">My Scores</h2>
            {scores.length > 0 ? (
              <div className="space-y-6">
                {scores.map((subEventScore) => (
                  <div key={subEventScore.subEventId} className="border-b border-gray-200 pb-4 last:border-b-0">
                    <h3 className="text-lg font-medium text-gray-800">
                      {event.subEvents.find((se) => se._id === subEventScore.subEventId)?.name || 'Unknown Sub-Event'}
                    </h3>
                    {subEventScore.rounds?.length > 0 ? (
                      <div className="mt-2">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Round
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Score
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {subEventScore.rounds.map((round) =>
                              Object.entries(round.scores).map(([category, score], index) => (
                                <tr key={`${round.roundId}-${category}`}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {index === 0 ? round.roundName || round.roundId : ''}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{category}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{score}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                        <p className="mt-2 text-gray-700 font-medium">
                          Total Score: {subEventScore.totalScore || 'N/A'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-600 mt-2">No scores available for this sub-event yet.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No scores available yet. Check back after the event starts.</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}