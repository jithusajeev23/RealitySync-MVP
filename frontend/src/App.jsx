import { useState } from 'react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setReceipt(null);

    if (!file) {
      setError('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      const res = await fetch('https://realitysync-backend.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setReceipt(data.receipt);
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">RealitySync</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="file">
              Upload a file
            </label>
            <input
              type="file"
              id="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Upload & Verify'}
          </button>

          {error && <p className="text-red-600 text-sm">{error}</p>}
          {receipt && (
            <div className="mt-4 text-sm text-gray-700 break-all">
              <p className="font-semibold mb-1">✅ Trust Receipt:</p>
              <pre className="bg-gray-100 p-2 rounded text-xs whitespace-pre-wrap">{JSON.stringify(receipt, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default App;
