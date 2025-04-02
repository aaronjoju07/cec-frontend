// components/FinalResult.js
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function FinalResult({ eventId, subEventId }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, [eventId, subEventId]);

  const fetchResults = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subevents/${eventId}/${subEventId}/results`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch results.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p className="text-gray-700">Loading results...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : results.length === 0 ? (
        <p className="text-gray-700">No results available yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Score</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((result, index) => (
                <tr key={result.participant._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {result.participant.name || result.participant.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{result.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}