'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // From your document
import axios from 'axios';

// Calendar component to display the calendar grid
function Calendar({ events, currentDate, setCurrentDate }) {
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const calendarDays = [];
  const days = daysInMonth(month, year);
  const firstDay = firstDayOfMonth(month, year);

  // Previous month's days
  const prevMonthDays = daysInMonth(month - 1, year);
  for (let i = prevMonthDays - firstDay + 1; i <= prevMonthDays; i++) {
    calendarDays.push({ day: i, month: 'prev' });
  }
  // Current month's days
  for (let i = 1; i <= days; i++) {
    calendarDays.push({ day: i, month: 'current' });
  }
  // Next month's days
  for (let i = 1; calendarDays.length < 42; i++) {
    calendarDays.push({ day: i, month: 'next' });
  }

  const handlePrev = () => {
    setMonth((prev) => (prev === 0 ? 11 : prev - 1));
    setYear((prev) => (month === 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setMonth((prev) => (prev === 11 ? 0 : prev + 1));
    setYear((prev) => (month === 11 ? prev + 1 : prev));
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-3">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrev} className="text-gray-600 hover:text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{`${monthNames[month]} ${year}`}</h2>
        <button onClick={handleNext} className="text-gray-600 hover:text-gray-800">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-gray-600 py-2">{day}</div>
        ))}
        {calendarDays.map((day, index) => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day.day).padStart(2, '0')}`;
          const dayEvents = day.month === 'current' ? events.filter(e => e.date === dateStr) : [];
          return <CalendarDay key={index} day={day} events={dayEvents} currentDate={currentDate} />;
        })}
      </div>
    </div>
  );
}

// CalendarDay component
function CalendarDay({ day, events, currentDate }) {
  const isCurrentDay = day.month === 'current' && 
    day.day === currentDate.getDate() && 
    currentDate.getMonth() === new Date().getMonth() && 
    currentDate.getFullYear() === new Date().getFullYear();

  return (
    <div
      className={`p-2 h-24 flex flex-col justify-between ${
        day.month === 'current' ? 'bg-white' : 'bg-gray-100'
      } border border-gray-200 rounded-md`}
    >
      <div className="text-sm text-center">
        {isCurrentDay ? (
          <span className="inline-block w-6 h-6 text-center rounded-full border-2 border-purple-600 text-purple-600 font-semibold">
            {day.day}
          </span>
        ) : (
          <span className={`${day.month === 'current' ? 'text-gray-800' : 'text-gray-400'}`}>
            {day.day}
          </span>
        )}
      </div>
      <div className="space-y-1">
        {events.map((event, index) => (
          <div
            key={index}
            className={`p-1 text-xs text-white rounded bg-${event.color}-500 flex flex-col`}
          >
            <span>{event.title}</span>
            <span>{event.timeStart}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sidebar component for Today's and Upcoming Events
function EventSidebar({ events, currentDate }) {
  const todayStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const todayEvents = events.filter(e => e.date === todayStr);
  const upcomingEvents = events.filter(e => new Date(e.date) > currentDate);

  return (
    <div className="w-64 p-4 bg-white rounded-xl shadow-lg mr-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Events</h3>
      {todayEvents.length > 0 ? (
        todayEvents.map((event, index) => (
          <div key={index} className="mb-2">
            <p className="text-sm font-medium text-gray-700">{event.title}</p>
            <p className="text-xs text-gray-500">{event.timeStart}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No events today</p>
      )}

      <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">Upcoming Events</h3>
      {upcomingEvents.length > 0 ? (
        upcomingEvents.map((event, index) => (
          <div key={index} className="mb-2">
            <p className="text-sm font-medium text-gray-700">{event.title}</p>
            <p className="text-xs text-gray-500">{event.date} {event.timeStart}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No upcoming events</p>
      )}
    </div>
  );
}

function EventCalendar() {
  const { user, isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchEventsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }

        let apiEvents = [];
        if (user.role === 'organizer') {
          const res = await axios.get('http://localhost:5000/api/events/organizer/my-events', {
            headers: { Authorization: `Bearer ${token}` },
          });
          apiEvents = res.data.events || [];
        } else if (user.role === 'student') {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/registrations/my-registrations`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const upcomingEvents = res.data.upcomingEvents || [];
          const pastEvents = res.data.pastEvents || [];
          apiEvents = [...upcomingEvents, ...pastEvents].map(reg => reg.event).filter(event => event);
        }

        const transformedEvents = apiEvents.map(event => {
          const startDate = new Date(event.conductedDates?.start || new Date());
          return {
            date: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
            title: event.name || 'Untitled Event',
            timeStart: startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            color: user.role === 'organizer' ? 'purple' : 'blue',
          };
        });

        setEvents(transformedEvents);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch events';
        setError(errorMessage);
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventsData();
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please log in to view your events.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex p-6">
      <EventSidebar events={events} currentDate={currentDate} />
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Event Calendar
        </h1>
        <p className="text-center text-gray-600 mb-4">
          View your events for {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}.
        </p>
        <Calendar events={events} currentDate={currentDate} setCurrentDate={setCurrentDate} />
      </div>
    </div>
  );
}

export default EventCalendar;