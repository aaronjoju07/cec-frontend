'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SchedulingPage() {
  // ... existing state and functions remain the same ...

  return (
    <div className="p-6 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Event Scheduling</h1>
        <button
          onClick={handleOptimizeSchedule}
          className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          disabled={loading}
        >
          {loading ? 'Optimizing...' : 'Optimize Schedule'}
        </button>
      </div>
      {loading ? (
        <div className="text-center text-gray-700">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <div key={event._id} className="bg-white p-4 rounded-md shadow-md border border-gray-200">
              <h2 className="text-lg font-medium text-gray-800">{event.name}</h2>
              <p className="text-gray-700">{event.description}</p>
              <p className="text-sm mt-2 text-gray-600">
                <strong className="text-gray-800">Start:</strong> {new Date(event.conductedDates.start).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                <strong className="text-gray-800">End:</strong> {new Date(event.conductedDates.end).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
