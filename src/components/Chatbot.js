// components/Chatbot.js
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);

  // Fetch registered events (example: from an API endpoint)
  // useEffect(() => {
  //   const fetchRegisteredEvents = async () => {
  //     try {
  //       const res =   await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/student/registered-events`, {
  //         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  //       });
  //       setRegisteredEvents(res.data.events.map(event => event.name));  // Adjust based on your API response
  //     } catch (error) {
  //       console.error('Error fetching registered events:', error);
  //     }
  //   };
  //   fetchRegisteredEvents();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5001/chat', {
        question,
        registered_events: registeredEvents
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setResponse(res.data.answer);
    } catch (error) {
      console.error('Chatbot error:', error);
      setResponse('Sorry, something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white p-4 rounded-md shadow-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-800">Chatbot</h3>
      <form onSubmit={handleSubmit} className="mt-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask about events..."
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={loading}
        />
        <button
          type="submit"
          className="mt-2 w-full bg-gray-700 text-white p-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Send'}
        </button>
      </form>
      {response && (
        <div className="mt-4 p-2 bg-gray-50 rounded-md text-gray-700">
          {response}
        </div>
      )}
    </div>
  );
}