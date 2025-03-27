// Replace the existing form and button styles with these:

return (
  <div className="p-6 bg-gray-50">
    <h1 className="text-2xl font-semibold mb-6 text-gray-900">Edit Event</h1>
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg bg-white p-6 rounded-lg shadow-sm">
    <div>
      <label className="block text-sm font-medium text-gray-800">Event Name</label>
      <input
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-900"
      required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-800">Description</label>
      <textarea
      name="description"
      value={formData.description}
      onChange={handleChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-900"
      required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-800">Start Date</label>
      <input
      type="datetime-local"
      name="conductedDates.start"
      value={formData.conductedDates.start}
      onChange={handleChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-900"
      required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-800">End Date</label>
      <input
      type="datetime-local"
      name="conductedDates.end"
      value={formData.conductedDates.end}
      onChange={handleChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-900"
      required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-800">Maximum Students</label>
      <input
      type="number"
      name="maximumStudents"
      value={formData.maximumStudents}
      onChange={handleChange}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-50 text-gray-900"
      min="1"
      />
    </div>
    <button
      type="submit"
      disabled={loading}
      className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
    >
      {loading ? 'Updating...' : 'Update Event'}
    </button>
    </form>
  </div>
);
