// components/ScoreSubmission.js
'use client';
import { useState } from 'react';
import axios from 'axios';

export default function ScoreSubmission({ eventId, subEventId, round, participants, onScoreSubmitted }) {
  const [participantId, setParticipantId] = useState('');
  const [scores, setScores] = useState({});
  const [error, setError] = useState('');

  const handleScoreChange = (category, value) => {
    setScores((prev) => ({ ...prev, [category]: parseInt(value, 10) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subevents/scores`,
        {
          eventId,
          subEventId,
          roundId: round._id,
          participantId,
          scores,
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setParticipantId('');
      setScores({});
      onScoreSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit scores.');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{round.name}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Participant</label>
          <select
            value={participantId}
            onChange={(e) => setParticipantId(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
            required
          >
            <option value="">Select Participant</option>
            {participants.map((part) => (
              <option key={part._id} value={part._id}>
                {part.name}
              </option>
            ))}
          </select>
        </div>
        {round.scoringCategories.map((cat) => (
          <div key={cat}>
            <label className="block text-sm font-medium text-gray-700">{cat}</label>
            <input
              type="number"
              value={scores[cat] || ''}
              onChange={(e) => handleScoreChange(cat, e.target.value)}
              placeholder={`Score for ${cat}`}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              min="0"
            />
          </div>
        ))}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
        >
          Submit Scores
        </button>
      </form>
    </div>
  );
}