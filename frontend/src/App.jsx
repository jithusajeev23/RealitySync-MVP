// App.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [trustReceipt, setTrustReceipt] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadStatus("");
    setTrustReceipt("");
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://realitysync-backend.onrender.com/upload",
        formData
      );
      setTrustReceipt(response.data.trust_receipt);
      setUploadStatus("✅ Uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus("❌ Upload failed.");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black font-mono">
      <h1 className="text-2xl font-bold mb-4">RealitySync - Upload File</h1>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload File
      </button>

      {uploadStatus && <p className="mt-4">{uploadStatus}</p>}

      {trustReceipt && (
        <div className="mt-4">
          <p>
            <strong>Trust Receipt:</strong>{" "}
            <a
              href={`/verify?hash=${encodeURIComponent(trustReceipt)}`}
              className="text-blue-600 underline"
            >
              {trustReceipt}
            </a>
          </p>
        </div>
      )}

      <Link to="/verify" className="block mt-6 text-blue-600 underline">
        🔍 Go to Verify Receipt Page
      </Link>
    </div>
  );
}

export default App;
