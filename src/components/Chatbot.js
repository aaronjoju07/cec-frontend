// components/Chatbot.js
'use client';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chatbot() {
  // State for toggling chatbot visibility
  const [isOpen, setIsOpen] = useState(false);
  // State for storing conversation history
  const [messages, setMessages] = useState([
    { type: 'ai', content: 'Hi, how can I help you today?' },
  ]);
  // State for user input
  const [question, setQuestion] = useState('');
  // State for loading status
  const [loading, setLoading] = useState(false);
  // State for registered events (assumed to be managed elsewhere)
  const [registeredEvents, setRegisteredEvents] = useState([]);
  // Ref for the chat container
  const chatContainerRef = useRef(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return; // Prevent empty submissions

    setLoading(true);
    // Add user's message to the conversation
    setMessages((prev) => [...prev, { type: 'user', content: question }]);
    setQuestion(''); // Clear input field

    try {
      const res = await axios.post(
        'http://localhost:5002/chat',
        {
          question,
          // registered_events: registeredEvents, // Commented out as in your version
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          }
        }
      );
      // Add AI's response to the conversation
      setMessages((prev) => [...prev, { type: 'ai', content: res.data.response }]);
    } catch (error) {
      console.error('Chatbot error:', error);
      // Add error message to the conversation
      setMessages((prev) => [
        ...prev,
        { type: 'ai', content: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to the bottom of the chat container whenever messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Toggle Button */}
      <button
        className="fixed bottom-4 right-4 inline-flex items-center justify-center text-sm font-medium disabled:pointer-events-none disabled:opacity-50 border rounded-full w-16 h-16 bg-black hover:bg-gray-700 m-0 cursor-pointer border-gray-200 p-0 normal-case leading-5 hover:text-gray-900"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white block border-gray-200 align-middle"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
        </svg>
      </button>

      {/* Chatbot Window (visible when isOpen is true) */}
      {isOpen && (
        <div className="fixed bottom-[calc(4rem+1.5rem)] right-0 mr-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm w-[440px] h-[634px]">
          {/* Heading */}
          <div className="flex flex-col space-y-1.5 pb-6">
            <h2 className="font-semibold text-black text-lg tracking-tight">Chatbot</h2>
            <p className="text-sm text-gray-500 leading-3">
              Powered by CECompanion
            </p>
          </div>

          {/* Chat Container with ref */}
          <div
            ref={chatContainerRef}
            className="pr-4 h-[474px] overflow-y-auto"
            style={{ minWidth: '0', maxWidth: '100%' }} // Adjusted to constrain width
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className="flex gap-3 my-4" // Removed flex-1 to prevent stretching
              >
                {/* Avatar */}
                <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                  <div className="rounded-full bg-gray-100 border p-1">
                    {message.type === 'ai' ? (
                      <svg
                        stroke="none"
                        fill="black"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                        />
                      </svg>
                    ) : (
                      <svg
                        stroke="none"
                        fill="black"
                        strokeWidth="0"
                        viewBox="0 0 16 16"
                        height="20"
                        width="20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z" />
                      </svg>
                    )}
                  </div>
                </span>
                {/* Message Content */}
                <div className="flex-1 min-w-0"> {/* Wrapped content in a div with flex-1 and min-w-0 */}
                  <p className="leading-relaxed text-black break-words">
                    <span className="block font-bold text-gray-700">
                      {message.type === 'ai' ? 'AI' : 'You'}{' '}
                    </span>
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex items-center pt-0">
            <form
              onSubmit={handleSubmit}
              className="flex items-center justify-center w-full space-x-2"
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your message"
                className="flex h-10 w-full rounded-md border border-gray-200 px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900 focus-visible:ring-offset-2"
                disabled={loading}
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-50 bg-black hover:bg-gray-800 h-10 px-4 py-2"
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}