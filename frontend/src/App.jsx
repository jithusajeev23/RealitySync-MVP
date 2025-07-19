import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [hash, setHash] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('❌ Please select a file first.');
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

      console.log("🔍 Full backend response:", response.data); // Debug log

      // Try all possible keys returned
      const returnedHash = response.data.trustHash || response.data.reality_hash || response.data.hash;

      if (returnedHash) {
        setMessage('✅ Uploaded successfully!');
        setHash(returnedHash);
      } else {
        setMessage('✅ Uploaded, but no hash returned.');
        setHash('');
      }

    } catch (error) {
      console.error('❌ Upload error:', error);
      setMessage('❌ Upload failed: ' + error.message);
      setHash('');
    }
  };

  return (
    <div style={{ padding: '30px' }}>
      <h1>RealitySync - Upload File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload File</button>
      {message && <p>{message}</p>}
      {hash && (
        <div>
          <p><strong>📎 Your Trust Hash:</strong></p>
          <textarea
            readOnly
            value={hash}
            rows={2}
            style={{ width: '100%', fontSize: '14px' }}
          />
        </div>
      )}
      <p>
        🔍 <Link to="/verify">Go to Verify Receipt Page</Link>
      </p>
    </div>
  );
}

export default UploadPage;
