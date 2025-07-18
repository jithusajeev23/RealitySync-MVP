// src/pages/UploadPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [hash, setHash] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setMessage('');
    setHash('');
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'https://realitysync-backend.onrender.com/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (response.data && response.data.trustHash) {
        setMessage('✅ Uploaded successfully!');
        setHash(response.data.trustHash);
      } else {
        setMessage('❌ Upload succeeded but no hash returned.');
      }
    } catch (error) {
      console.error(error);
      setMessage('❌ Upload failed: ' + error.message);
    }
  };

  const copyHashToClipboard = () => {
    if (hash) {
      navigator.clipboard.writeText(hash);
      alert('Hash copied to clipboard!');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">RealitySync - Upload File</h1>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <br />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload File
      </button>

      {message && (
        <div className="mt-4 text-green-600 font-semibold">{message}</div>
      )}

      {hash && (
        <div className="mt-4">
          <div>
            <strong>File Trust Hash:</strong>
            <pre className="break-all bg-gray-100 p-2 rounded">{hash}</pre>
          </div>
          <button
            onClick={copyHashToClipboard}
            className="mt-2 px-3 py-1 bg-gray-800 text-white rounded hover:bg-gray-900"
          >
            Copy Hash
          </button>
          <br />
          <Link
            to={`/verify?hash=${hash}`}
            className="text-blue-600 underline mt-3 inline-block"
          >
            🔍 Verify this file
          </Link>
        </div>
      )}
    </div>
  );
}

export default UploadPage;
