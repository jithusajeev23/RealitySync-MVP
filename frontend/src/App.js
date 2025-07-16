import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Verify from "./Verify";
import Receipts from "./pages/Receipts"; // ✅ NEW
import "./App.css";

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
      const response = await fetch("http://localhost:5000/upload", {
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
        <Link to="/receipts">📂 View Trust Receipts</Link> {/* ✅ NEW */}
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
        <Route path="/receipts" element={<Receipts />} /> {/* ✅ NEW */}
      </Routes>
    </Router>
  );
}

export default App;
