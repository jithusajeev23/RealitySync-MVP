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
        'https://realitysync-backend.onrender.com/upload', // replace with your actual backend URL
        formData
      );
      setStatus('✅ Uploaded successfully!');
      setHash(response.data.hash);
    } catch (error) {
      setStatus('❌ Upload failed: ' + error.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">RealitySync - Upload File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} className="ml-2 px-4 py-2 bg-blue-500 text-white">Upload File</button>

      {status && <p className="mt-4">{status}</p>}
      {hash && (
        <div className="mt-2">
          <p><strong>File Hash:</strong></p>
          <code className="bg-gray-100 p-2 rounded inline-block">{hash}</code>
        </div>
      )}

      <div className="mt-6">
        <a href="/verify" className="text-blue-700 underline">🔍 Go to Verify Receipt Page</a>
      </div>
    </div>
  );
}

export default UploadPage;
