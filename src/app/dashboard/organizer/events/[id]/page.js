// app/dashboard/organizer/events/[id]/page.js
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function EventDetailPage() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/events/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEvent(res.data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setError(error.response?.data?.message || 'Failed to load event details.');
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

  if (error) {
    return (
      <div className="p-6 text-center text-gray-800">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!event) {
    return <div className="p-6 text-center text-gray-800">Event not found</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-900 mb-8">{event.name}</h1>

      <div className="space-y-8">
        {/* Event Overview */}
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
          </div>
        </section>

        {/* Organizing Details */}
        <section className="bg-white p-6 rounded-md shadow-md border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Organizing Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700">
              <strong>Institution:</strong> {event.organizingInstitution || 'Not specified'}
            </p>
            <p className="text-gray-700">
              <strong>College:</strong> {event.organizingCollege || 'Not specified'}
            </p>
          </div>
        </section>

        {/* Targeted Audience */}
        <section className="bg-white p-6 rounded-md shadow-md border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Targeted Audience</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-700 font-medium">Departments:</p>
              {event.targetedAudience?.departments?.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {event.targetedAudience.departments.map((dept, index) => (
                    <li key={index} className="text-gray-700">{dept}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">None specified</p>
              )}
            </div>
            <div>
              <p className="text-gray-700 font-medium">Courses:</p>
              {event.targetedAudience?.courses?.length > 0 ? (
                <ul className="mt-2 space-y-1">
                  {event.targetedAudience.courses.map((course, index) => (
                    <li key={index} className="text-gray-700">{course}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">None specified</p>
              )}
            </div>
          </div>
        </section>

        {/* General Rules */}
        <section className="bg-white p-6 rounded-md shadow-md border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-4">General Rules</h2>
          {event.generalRules?.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {event.generalRules.map((rule, index) => (
                <li key={index}>{rule}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No rules specified</p>
          )}
        </section>

        {/* Contact Information */}
        <section className="bg-white p-6 rounded-md shadow-md border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <p className="text-gray-700">
              <strong>Email:</strong> {event.contactInfo?.email || 'Not specified'}
            </p>
            <p className="text-gray-700">
              <strong>Phone:</strong> {event.contactInfo?.phone || 'Not specified'}
            </p>
          </div>
        </section>

        {/* Sub-Events */}
        <section className="bg-white p-6 rounded-md shadow-md border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Sub-Events</h2>
          {event.subEvents?.length > 0 ? (
            <div className="space-y-4">
              {event.subEvents.map((subEvent) => (
                <div key={subEvent._id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h3 className="text-lg font-medium text-gray-800">{subEvent.name}</h3>
                  <p className="text-gray-700 mt-1">{subEvent.overview || 'No overview provided'}</p>
                  <p className="text-gray-700 mt-1">
                    <strong>Venue:</strong> {subEvent.venue || 'Not specified'}
                  </p>
                  {subEvent.prizePools?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-gray-700 font-medium">Prize Pools:</p>
                      <ul className="mt-1 space-y-1">
                        {subEvent.prizePools.map((prize, index) => (
                          <li key={index} className="text-gray-700">
                            Rank {prize.rank}: ${prize.amount}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No sub-events available</p>
          )}
        </section>

        {/* Registered Students */}
        <section className="bg-white p-6 rounded-md shadow-md border border-gray-200">
          <h2 className="text-xl font-medium text-gray-800 mb-4">
            Registered Students ({event.registeredStudents.length})
          </h2>
          {event.registeredStudents?.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {event.registeredStudents.map((student) => (
                <li
                  key={student._id}
                  className="text-gray-700 bg-gray-50 p-2 rounded-md flex items-center justify-between"
                >
                  <span>{student.username}</span>
                  {/* Optional: Add more student details if available, e.g., email */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No students registered yet</p>
          )}
        </section>
      </div>
    </div>
  );
}