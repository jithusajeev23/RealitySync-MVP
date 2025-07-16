import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Verify from "./Verify";
import Receipts from "./pages/Receipts";
import "./App.css";

// ✅ Use environment variable for backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Upload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [realityHash, setRealityHash] = useState("");
  const [verifyUrl, setVerifyUrl] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message);
        setRealityHash(result.reality_hash);
        setVerifyUrl(result.verify_url);
      } else {
        setMessage(result.error || "Upload failed");
      }
    } catch (error) {
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div className="App">
      <h1>RealitySync – Upload File for Verification</h1>
      <nav>
        <Link to="/verify">🔍 Go to Verify Page</Link> |{" "}
        <Link to="/receipts">📂 View Trust Receipts</Link>
      </nav>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>

      {realityHash && (
        <div>
          <p><strong>RealityHash:</strong> {realityHash}</p>
          <p>
            🔗 <a href={verifyUrl} target="_blank" rel="noreferrer">
              View Trust Receipt
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/receipts" element={<Receipts />} />
      </Routes>
    </Router>
  );
}

export default App;
