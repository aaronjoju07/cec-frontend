// Modify the form and button styles in the return statement
// Replace the existing classes with these:

<div className="p-6 bg-gray-50"> {/* Added bg-gray-50 for light gray background */}
  <h1 className="text-2xl font-semibold mb-6 text-gray-900">Create New Event</h1>
  <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
    {/* For each input/textarea, update the className to: */}
    className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white text-gray-900 focus:ring-gray-500 focus:border-gray-500"

    {/* For the labels, update the className to: */}
    className="block text-sm font-medium text-gray-700"

    {/* For the submit button, update the className to: */}
    className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
  </form>
</div>
