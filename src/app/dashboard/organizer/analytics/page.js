'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default function AnalyticsPage() {
  const [insights, setInsights] = useState(null);
  const [eventAnalytics, setEventAnalytics] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInsights();
    fetchEvents();
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

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/organizer/my-events`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvents(res.data.events);
      // Fetch analytics for each event
      const analyticsPromises = res.data.events.map(event =>
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/event-participation/${event._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        })
      );
      const analyticsResponses = await Promise.all(analyticsPromises);
      setEventAnalytics(analyticsResponses.map(res => res.data.analytics));
    } catch (error) {
      console.error('Error fetching events or event analytics:', error);
    }
  };

  // Prepare data for the Event Status Breakdown (Doughnut Chart)
  const statusChartData = {
    labels: insights?.eventStatusBreakdown.map(status => status._id) || [],
    datasets: [
      {
        data: insights?.eventStatusBreakdown.map(status => status.count) || [],
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1'], // Colors matching the image
        borderWidth: 0,
      },
    ],
  };

  // Prepare data for the Department Participation (Bar Chart)
  const departmentChartData = {
    labels: insights?.departmentParticipation.map(dept => dept._id) || [],
    datasets: [
      {
        label: 'Students',
        data: insights?.departmentParticipation.map(dept => dept.studentCount) || [],
        backgroundColor: '#FF9F43', // Orange color from the image
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: '#333333', // Dark text for chart legends
        },
      },
    },
  };

  const barChartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: '#333333', // Dark text for x-axis ticks
        },
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: '#333333', // Dark text for y-axis ticks
        },
        grid: {
          color: '#E5E7EB', // Light gray grid lines
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading) return <div className="p-6 text-center text-gray-500 bg-white min-h-screen">Loading...</div>;
  if (!insights) return <div className="p-6 text-center text-gray-500 bg-white min-h-screen">No data available</div>;

  return (
    <div className="p-6 bg-white min-h-screen text-gray-800">
      <h1 className="text-3xl font-semibold mb-6 text-gray-900">Event Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-sm font-medium text-gray-600">Total Events</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">{insights.totalEvents}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-sm font-medium text-gray-600">Total Registrations</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">{insights.totalRegistrations}</p>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-sm font-medium text-gray-600">Average Registrations per Event</h2>
          <p className="text-4xl font-bold text-gray-900 mt-2">
            {insights.totalEvents > 0 ? Math.round(insights.totalRegistrations / insights.totalEvents) : 0}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-600">Department Participation</h2>
            <select className="bg-gray-200 text-gray-800 rounded-md px-2 py-1 text-sm">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64">
            <Bar data={departmentChartData} options={barChartOptions} />
          </div>
        </div>
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-600">Event Status Breakdown</h2>
            <select className="bg-gray-200 text-gray-800 rounded-md px-2 py-1 text-sm">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-40 h-40">
              <Doughnut data={statusChartData} options={chartOptions} />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-bold text-gray-900">
                  {insights.eventStatusBreakdown.reduce((sum, status) => sum + status.count, 0)} <br />
                  <span className="text-sm text-gray-600">Total</span>
                </p>
              </div>
            </div>
            <div className="ml-6">
              {statusChartData.labels.map((label, index) => (
                <div key={label} className="flex items-center mb-2">
                  <span
                    className="w-4 h-4 mr-2 rounded-full"
                    style={{ backgroundColor: statusChartData.datasets[0].backgroundColor[index] }}
                  ></span>
                  <span className="text-gray-600">{label}: {statusChartData.datasets[0].data[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Individual Event Analytics Table */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium text-gray-600 mb-4">Individual Event Analytics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-gray-800">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Event Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Total Registrations</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Registered Students</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Maximum Capacity</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Sub-Events</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => {
                const analytics = eventAnalytics[index] || {};
                return (
                  <tr key={event._id} className="border-b border-gray-300">
                    <td className="py-3 px-4">{event.name}</td>
                    <td className="py-3 px-4">{analytics.totalRegistrations || 0}</td>
                    <td className="py-3 px-4">{analytics.registeredStudents || 0}</td>
                    <td className="py-3 px-4">{analytics.maximumCapacity || event.maximumStudents}</td>
                    <td className="py-3 px-4">{event.subEvents.length}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
