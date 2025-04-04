// app/dashboard/events/[id]/scores/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export default function EventScoresPage() {
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
      setError('Please log in to view your scores.');
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
      // Fetch event details including sub-events
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
        setError('You are not registered for this event.');
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
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">
        My Scores for {event?.name || 'Event'}
      </h1>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>
      )}

      {!isStudent || !isRegistered ? (
        <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 text-gray-700">
          <p>You must be a registered student to view scores for this event.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {scores.length > 0 ? (
            scores.map((subEventScore) => {
              const subEvent = event.subEvents.find((se) => se._id === subEventScore.subEventId);
              return (
                <section
                  key={subEventScore.subEventId}
                  className="bg-white p-6 rounded-md shadow-md border border-gray-200"
                >
                  <h2 className="text-xl font-medium text-gray-800 mb-4">
                    {subEvent?.name || 'Unknown Sub-Event'}
                  </h2>
                  <p className="text-gray-700 mb-2">
                    <strong>Overview:</strong> {subEvent?.overview || 'No overview provided'}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Venue:</strong> {subEvent?.venue || 'Not specified'}
                  </p>
                  <p className="text-gray-700 mb-4">
                    <strong>Time:</strong>{' '}
                    {subEvent?.time ? new Date(subEvent.time).toLocaleString() : 'Not specified'}
                  </p>

                  {subEventScore.rounds?.length > 0 ? (
                    <div className="mt-2">
                      <h3 className="text-lg font-medium text-gray-800 mb-2">Rounds and Scores</h3>
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {category}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                  {score}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                      <p className="mt-4 text-gray-700 font-medium">
                        Total Score: {subEventScore.totalScore || 'N/A'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-gray-600 mt-2">No scores available for this sub-event yet.</p>
                  )}
                </section>
              );
            })
          ) : (
            <div className="bg-white p-6 rounded-md shadow-md border border-gray-200 text-gray-600">
              <p>No scores available yet. Check back after the event starts.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}