'use client';
import { useState } from 'react';
import axios from 'axios';

export default function EventForm() {
  const [eventData, setEventData] = useState({
    name: '',
    description: '',
    conductedDates: { start: '', end: '' },
    targetedAudience: { departments: [], courses: [] },
    organizingInstitution: '',
    maximumStudents: '',
    maxEventsPerStudent: '',
    organizingCollege: '',
    generalRules: [],
    contactInfo: { email: '', phone: '' },
    subEvents: [],
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [uploading, setUploading] = useState(false); // New state for upload status

  // Handler for top-level input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for nested field changes (e.g., conductedDates, contactInfo)
  const handleNestedChange = (path, value) => {
    setEventData((prev) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  // Handler to add items to arrays (generalRules, departments, courses)
  const addItem = (field, value) => {
    if (!value.trim()) return;
    setEventData((prev) => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: [...prev[field], value] };
      } else {
        const nested = { ...prev[keys[0]], [keys[1]]: [...prev[keys[0]][keys[1]], value] };
        return { ...prev, [keys[0]]: nested };
      }
    });
  };

  // Handler to remove items from arrays
  const removeItem = (field, index) => {
    setEventData((prev) => {
      const keys = field.split('.');
      if (keys.length === 1) {
        return { ...prev, [field]: prev[field].filter((_, i) => i !== index) };
      } else {
        const nested = {
          ...prev[keys[0]],
          [keys[1]]: prev[keys[0]][keys[1]].filter((_, i) => i !== index),
        };
        return { ...prev, [keys[0]]: nested };
      }
    });
  };

  // Handler to add a new sub-event
  const addSubEvent = () => {
    setEventData((prev) => ({
      ...prev,
      subEvents: [...prev.subEvents, { name: '', overview: '', venue: '', prizePools: [] }],
    }));
  };

  // Handler to remove a sub-event
  const removeSubEvent = (index) => {
    setEventData((prev) => ({
      ...prev,
      subEvents: prev.subEvents.filter((_, i) => i !== index),
    }));
  };

  // Handler for sub-event field changes
  const handleSubEventChange = (index, field, value) => {
    setEventData((prev) => {
      const newSubEvents = [...prev.subEvents];
      newSubEvents[index][field] = value;
      return { ...prev, subEvents: newSubEvents };
    });
  };

  // Handler to add a prize pool to a sub-event
  const addPrizePool = (subIndex) => {
    setEventData((prev) => {
      const newSubEvents = [...prev.subEvents];
      newSubEvents[subIndex].prizePools.push({ rank: '', amount: '' });
      return { ...prev, subEvents: newSubEvents };
    });
  };

  // Handler to remove a prize pool from a sub-event
  const removePrizePool = (subIndex, prizeIndex) => {
    setEventData((prev) => {
      const newSubEvents = [...prev.subEvents];
      newSubEvents[subIndex].prizePools = newSubEvents[subIndex].prizePools.filter(
        (_, i) => i !== prizeIndex
      );
      return { ...prev, subEvents: newSubEvents };
    });
  };

  // Handler for prize pool field changes
  const handlePrizePoolChange = (subIndex, prizeIndex, field, value) => {
    setEventData((prev) => {
      const newSubEvents = [...prev.subEvents];
      newSubEvents[subIndex].prizePools[prizeIndex][field] = value;
      return { ...prev, subEvents: newSubEvents };
    });
  };

  // New function to handle PDF upload and extraction
  const handlePdfUpload = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file to upload.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await axios.post('http://localhost:5001/extract-event-details', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      await axios.post('http://localhost:5002/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const extractedData = response.data;

      // Helper function to format dates for datetime-local input
      const formatDateForInput = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toISOString().slice(0, 16); // e.g., "2025-04-15T09:00"
      };

      // Update eventData with extracted data, preserving existing data if not provided
      setEventData((prev) => ({
        ...prev,
        name: extractedData.name || prev.name,
        description: extractedData.description || prev.description,
        conductedDates: {
          start: extractedData.conductedDates?.start
            ? formatDateForInput(extractedData.conductedDates.start)
            : prev.conductedDates.start,
          end: extractedData.conductedDates?.end
            ? formatDateForInput(extractedData.conductedDates.end)
            : prev.conductedDates.end,
        },
        targetedAudience: {
          departments: extractedData.targetedAudience?.departments || prev.targetedAudience.departments,
          courses: extractedData.targetedAudience?.courses || prev.targetedAudience.courses,
        },
        organizingInstitution: extractedData.organizingInstitution || prev.organizingInstitution,
        organizingCollege: extractedData.organizingCollege || prev.organizingCollege,
        maximumStudents: extractedData.maximumStudents || prev.maximumStudents,
        maxEventsPerStudent: extractedData.maxEventsPerStudent || prev.maxEventsPerStudent,
        generalRules: extractedData.generalRules || prev.generalRules,
        contactInfo: {
          email: extractedData.contactInfo?.email || prev.contactInfo.email,
          phone: extractedData.contactInfo?.phone || prev.contactInfo.phone,
        },
        subEvents: extractedData.subEvents || prev.subEvents,
      }));

      alert('PDF details extracted and populated successfully!');
    } catch (error) {
      console.error('PDF extraction error:', error);
      alert('Failed to extract details from PDF. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Submission handler
  const handleSubmit = async () => {
    // Validate required fields
    if (
      !eventData.name ||
      !eventData.description ||
      !eventData.conductedDates.start ||
      !eventData.conductedDates.end
    ) {
      alert('Please fill in all required fields: Name, Description, Start Date, and End Date.');
      return;
    }

    // Format data for backend
    const submitData = {
      ...eventData,
      conductedDates: {
        start: eventData.conductedDates.start
          ? new Date(eventData.conductedDates.start).toISOString()
          : '',
        end: eventData.conductedDates.end
          ? new Date(eventData.conductedDates.end).toISOString()
          : '',
      },
      maximumStudents: eventData.maximumStudents ? parseInt(eventData.maximumStudents) : 100,
      maxEventsPerStudent: eventData.maxEventsPerStudent
        ? parseInt(eventData.maxEventsPerStudent)
        : 3,
      subEvents: eventData.subEvents.map((sub) => ({
        ...sub,
        prizePools: sub.prizePools.map((prize) => ({
          rank: isNaN(parseInt(prize.rank)) ? 0 : parseInt(prize.rank),
          amount: isNaN(parseFloat(prize.amount)) ? 0 : parseFloat(prize.amount),
        })),
      })),
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events`,
        submitData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Event created successfully!');
      console.log(response.data);
      // Reset form
      setEventData({
        name: '',
        description: '',
        conductedDates: { start: '', end: '' },
        targetedAudience: { departments: [], courses: [] },
        organizingInstitution: '',
        maximumStudents: '',
        maxEventsPerStudent: '',
        organizingCollege: '',
        generalRules: [],
        contactInfo: { email: '', phone: '' },
        subEvents: [],
      });
      setPdfFile(null);
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'Failed to create event'}`);
      } else if (error.request) {
        alert('Error: No response from server. Please check your network.');
      } else {
        alert('Error: An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* PDF Upload */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-black">Event PDF (Optional)</h3>
        <div className="flex items-center gap-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setPdfFile(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
          />
          <button
            type="button"
            onClick={handlePdfUpload}
            disabled={uploading || !pdfFile}
            className={`py-2 px-4 rounded-md text-white ${uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-600 hover:bg-gray-700'
              }`}
          >
            {uploading ? 'Extracting...' : 'Extract Details'}
          </button>
        </div>
      </section>
      {/* Event Details */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-black">Event Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={eventData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              placeholder="e.g., Tech Fest 2025"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              rows="3"
              placeholder="e.g., Annual technology festival..."
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="datetime-local"
              value={eventData.conductedDates.start}
              onChange={(e) => handleNestedChange('conductedDates.start', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="datetime-local"
              value={eventData.conductedDates.end}
              onChange={(e) => handleNestedChange('conductedDates.end', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              required
            />
          </div>
        </div>
      </section>

      {/* Targeted Audience */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-black">Targeted Audience</h3>
        <div className="space-y-6">
          {/* Departments */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Departments</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {eventData.targetedAudience.departments.map((dept, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
                >
                  {dept}
                  <button
                    type="button"
                    onClick={() => removeItem('targetedAudience.departments', index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem('targetedAudience.departments', e.target.value);
                  e.target.value = '';
                  e.preventDefault();
                }
              }}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              placeholder="Type and press Enter (e.g., Computer Science)"
            />
          </div>
          {/* Courses */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Courses</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {eventData.targetedAudience.courses.map((course, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
                >
                  {course}
                  <button
                    type="button"
                    onClick={() => removeItem('targetedAudience.courses', index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem('targetedAudience.courses', e.target.value);
                  e.target.value = '';
                  e.preventDefault();
                }
              }}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              placeholder="Type and press Enter (e.g., B.Tech)"
            />
          </div>
        </div>
      </section>

      {/* Organizing Details */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-black">Organizing Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Organizing Institution</label>
            <input
              type="text"
              name="organizingInstitution"
              value={eventData.organizingInstitution}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              placeholder="e.g., XYZ University"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Organizing College</label>
            <input
              type="text"
              name="organizingCollege"
              value={eventData.organizingCollege}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              placeholder="e.g., ABC College of Engineering"
            />
          </div>
        </div>
      </section>

      {/* Student Limits */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-black">Student Limits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Maximum Students</label>
            <input
              type="number"
              name="maximumStudents"
              value={eventData.maximumStudents}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              min="1"
              placeholder="e.g., 200"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Events Per Student</label>
            <input
              type="number"
              name="maxEventsPerStudent"
              value={eventData.maxEventsPerStudent}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              min="1"
              placeholder="e.g., 3"
            />
          </div>
        </div>
      </section>

      {/* Rules and Contact */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-black">Rules and Contact</h3>
        <div className="space-y-6">
          {/* General Rules */}
          <div>
            <label className="block text-sm font-medium text-gray-700">General Rules</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {eventData.generalRules.map((rule, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800"
                >
                  {rule}
                  <button
                    type="button"
                    onClick={() => removeItem('generalRules', index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  addItem('generalRules', e.target.value);
                  e.target.value = '';
                  e.preventDefault();
                }
              }}
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
              placeholder="Type and press Enter (e.g., No outside food)"
            />
          </div>
          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={eventData.contactInfo.email}
                onChange={(e) => handleNestedChange('contactInfo.email', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
                placeholder="e.g., events@xyz.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                value={eventData.contactInfo.phone}
                onChange={(e) => handleNestedChange('contactInfo.phone', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
                placeholder="e.g., +1234567890"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sub Events */}
      <section>
        <h3 className="text-xl font-semibold mb-4 text-black">Sub Events</h3>
        {eventData.subEvents.map((subEvent, subIndex) => (
          <div key={subIndex} className="mb-6 p-6 border border-gray-200 rounded-md">
            <h4 className="text-lg font-medium text-black mb-4">Sub-Event {subIndex + 1}</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={subEvent.name}
                  onChange={(e) => handleSubEventChange(subIndex, 'name', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
                  placeholder="e.g., Hackathon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Overview</label>
                <textarea
                  value={subEvent.overview}
                  onChange={(e) => handleSubEventChange(subIndex, 'overview', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
                  rows="2"
                  placeholder="e.g., 24-hour coding challenge"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Venue</label>
                <input
                  type="text"
                  value={subEvent.venue}
                  onChange={(e) => handleSubEventChange(subIndex, 'venue', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
                  placeholder="e.g., Main Hall"
                />
              </div>
              {/* Prize Pools */}
              <div>
                <h5 className="text-md font-medium text-black mb-2">Prize Pools</h5>
                {subEvent.prizePools.map((prize, prizeIndex) => (
                  <div key={prizeIndex} className="flex items-end gap-4 mb-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Rank</label>
                      <input
                        type="number"
                        value={prize.rank}
                        onChange={(e) =>
                          handlePrizePoolChange(subIndex, prizeIndex, 'rank', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
                        min="1"
                        placeholder="e.g., 1"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <input
                        type="number"
                        value={prize.amount}
                        onChange={(e) =>
                          handlePrizePoolChange(subIndex, prizeIndex, 'amount', e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 text-black"
                        min="0"
                        step="0.01"
                        placeholder="e.g., 1000"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removePrizePool(subIndex, prizeIndex)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addPrizePool(subIndex)}
                  className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300"
                >
                  Add Prize Pool
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeSubEvent(subIndex)}
              className="mt-4 text-red-600 hover:text-red-800"
            >
              Remove Sub-Event
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addSubEvent}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Add Sub-Event
        </button>
      </section>



      {/* Submit Button */}
      <div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full inline-flex justify-center py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Create Event
        </button>
      </div>
    </div>
  );
}