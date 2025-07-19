// frontend/src/pages/UploadPage.jsx

import React, { useState } from 'react';
import axios from 'axios';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [hash, setHash] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setStatus('');
    setHash('');
  };

  const handleUpload = async () => {
    if (!file) {
      setStatus('❌ No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://realitysync-backend.onrender.com/upload',
        formData
      );
      setStatus('✅ Uploaded successfully!');
      setHash(response.data.hash);
    } catch (error) {
      setStatus('❌ Upload failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800 p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl text-center">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">RealitySync – Upload File</h1>

        <input
          type="file"
          onChange={handleFileChange}
          className="w-full mb-4 p-2 border border-gray-300 rounded cursor-pointer bg-white"
        />

        <button
          onClick={handleUpload}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition duration-200"
        >
          ⬆️ Upload File
        </button>

        {status && (
          <p
            className={`mt-4 font-medium ${
              status.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {status}
          </p>
        )}

        {hash && (
          <div className="mt-6 text-left bg-gray-50 p-4 rounded border border-gray-200">
            <p className="text-sm font-semibold mb-1 text-gray-600">File Hash:</p>
            <code className="break-all text-blue-800 bg-blue-50 p-2 rounded block text-sm">
              {hash}
            </code>
          </div>
        )}

        <div className="mt-6">
          <a
            href="/verify"
            className="inline-block text-blue-600 hover:text-blue-800 underline transition"
          >
            🔍 Go to Verify Receipt Page
          </a>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
