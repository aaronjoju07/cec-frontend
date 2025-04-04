'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

export default function EventSchedulePage() {
  const { id } = useParams();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, [id]);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/scheduling/schedule?eventId=${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSchedules(res.data.schedules);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (schedule) => {
    setEditingSchedule({ ...schedule });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/scheduling/edit/${editingSchedule._id}`,
        editingSchedule,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setSchedules(schedules.map(s => s._id === editingSchedule._id ? editingSchedule : s));
      setEditingSchedule(null);
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-semibold mb-6">Event Schedule</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div key={schedule._id} className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-medium">{schedule.subEventName}</h2>
              <p>Priority: {schedule.priority}</p>
              {editingSchedule?._id === schedule._id ? (
                <div>
                  {schedule.rounds.map((round, idx) => (
                    <div key={round.roundId} className="mt-2">
                      <input
                        type="text"
                        value={round.name}
                        onChange={(e) => {
                          const newRounds = [...editingSchedule.rounds];
                          newRounds[idx].name = e.target.value;
                          setEditingSchedule({ ...editingSchedule, rounds: newRounds });
                        }}
                        className="border p-2 rounded"
                      />
                      <input
                        type="datetime-local"
                        value={new Date(round.timeSlot.start).toISOString().slice(0, 16)}
                        onChange={(e) => {
                          const newRounds = [...editingSchedule.rounds];
                          newRounds[idx].timeSlot.start = new Date(e.target.value);
                          newRounds[idx].timeSlot.end = new Date(newRounds[idx].timeSlot.start.getTime() + 2 * 60 * 60 * 1000);
                          setEditingSchedule({ ...editingSchedule, rounds: newRounds });
                        }}
                        className="border p-2 rounded ml-2"
                      />
                    </div>
                  ))}
                  <button onClick={handleSave} className="mt-2 bg-gray-700 text-white px-4 py-2 rounded">Save</button>
                  <button onClick={() => setEditingSchedule(null)} className="mt-2 ml-2 bg-gray-300 px-4 py-2 rounded">Cancel</button>
                </div>
              ) : (
                <div>
                  {schedule.rounds.map((round) => (
                    <p key={round.roundId}>
                      {round.name}: {new Date(round.timeSlot.start).toLocaleString()} - {new Date(round.timeSlot.end).toLocaleString()}
                    </p>
                  ))}
                  <button onClick={() => handleEdit(schedule)} className="mt-2 bg-gray-600 text-white px-4 py-2 rounded">Edit</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}