// components/RoundManagement.js
'use client';
import { useState } from 'react';
import axios from 'axios';

export default function RoundManagement({ eventId, subEventId, onRoundAdded }) {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subevents/rounds`,
        {
          eventId,
          subEventId,
          name,
          scoringCategories: categories.split(',').map((cat) => cat.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setName('');
      setCategories('');
      onRoundAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add round.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Round Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Round 1"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Scoring Categories (comma-separated)</label>
        <input
          type="text"
          value={categories}
          onChange={(e) => setCategories(e.target.value)}
          placeholder="e.g., Technical, Presentation, Creativity"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
      >
        Add Round
      </button>
    </form>
  );
}