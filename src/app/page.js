'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    setLoading(true);
    setMessage('');
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('http://localhost:5002/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Upload successful!');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Upload PDF</h2>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
        <button 
          onClick={handleUpload} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
