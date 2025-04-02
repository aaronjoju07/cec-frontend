// app/dashboard/organizer/subevents/[eventId]/[subEventId]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import RoundManagement from '@/components/RoundManagement';
import ScoreSubmission from '@/components/ScoreSubmission';
import FinalResult from '@/components/FinalResult';

export default function SubEventDetailPage() {
  const { eventId, subEventId } = useParams();
  const [subEvent, setSubEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubEvent();
  }, [eventId, subEventId]);

  const fetchSubEvent = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const event = response.data;
      const subEventData = event.subEvents.find((se) => se._id === subEventId);
      setSubEvent(subEventData);
      setParticipants(event.registeredStudents.map((student) => ({
        _id: student._id,
        name: student.username, // Adjust based on your User schema
      })));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch sub-event details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Manage Sub-Event: {subEvent?.name || 'Loading...'}
      </h1>
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">{error}</div>
      )}
      {loading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : !subEvent ? (
        <div className="text-center text-gray-700">Sub-event not found.</div>
      ) : (
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Add Rounds</h2>
            <RoundManagement
              eventId={eventId}
              subEventId={subEventId}
              onRoundAdded={fetchSubEvent}
            />
          </section>
          <section className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Submit Scores</h2>
            {subEvent.rounds.length === 0 ? (
              <p className="text-gray-700">No rounds created yet.</p>
            ) : (
              subEvent.rounds.map((round) => (
                <ScoreSubmission
                  key={round._id}
                  eventId={eventId}
                  subEventId={subEventId}
                  round={round}
                  participants={participants}
                  onScoreSubmitted={fetchSubEvent}
                />
              ))
            )}
          </section>
          <section className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-medium text-gray-800 mb-4">Final Results</h2>
            <FinalResult eventId={eventId} subEventId={subEventId} />
          </section>
        </div>
      )}
    </div>
  );
}