'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AnalyticsPage() {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/overall-insights`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setInsights(res.data.insights);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (!insights) return <div className="p-6 text-center">No data available</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Event Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-medium">Total Events</h2>
          <p className="text-2xl font-bold text-indigo-600">{insights.totalEvents}</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md">
          <h2 className="text-lg font-medium">Total Registrations</h2>
          <p className="text-2xl font-bold text-indigo-600">{insights.totalRegistrations}</p>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md col-span-1 md:col-span-2">
          <h2 className="text-lg font-medium">Event Status Breakdown</h2>
          <ul className="mt-2">
            {insights.eventStatusBreakdown.map((status) => (
              <li key={status._id} className="text-gray-700">
                {status._id}: {status.count}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded-md shadow-md col-span-1 md:col-span-2">
          <h2 className="text-lg font-medium">Department Participation</h2>
          <ul className="mt-2">
            {insights.departmentParticipation.map((dept) => (
              <li key={dept._id} className="text-gray-700">
                {dept._id}: {dept.studentCount} students
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}