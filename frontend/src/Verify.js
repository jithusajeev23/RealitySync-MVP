import React, { useState } from "react";
import jsPDF from "jspdf";

function Verify() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    const cleanHash = hash.trim();

    if (!cleanHash || cleanHash.length < 64) {
      setError("Please enter a valid RealityHash.");
      setResult(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/verify/${cleanHash}`);
      const data = await response.json();

      if (response.ok) {
        setResult(data);
        setError("");
      } else {
        setResult(null);
        setError(data.error || "Verification failed.");
      }
    } catch (err) {
      setResult(null);
      setError("Server error. Please try again later.");
    }
  };

  const copyToClipboard = () => {
    if (result?.reality_hash) {
      navigator.clipboard.writeText(result.reality_hash);
      alert("RealityHash copied to clipboard!");
    }
  };

  const shareHash = async () => {
    if (!result) return;

    const shareData = {
      title: "RealitySync Verification",
      text: `✅ File Verified!\nFilename: ${result.filename}\nRealityHash: ${result.reality_hash}\nUploaded On: ${new Date(result.timestamp).toLocaleString()}`,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        alert("Hash shared successfully!");
      } catch (err) {
        alert("Share failed or cancelled.");
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("RealitySync - Trust Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Filename: ${result.filename}`, 20, 40);
    doc.text(`RealityHash: ${result.reality_hash}`, 20, 50);
    doc.text(`Uploaded On: ${new Date(result.timestamp).toLocaleString()}`, 20, 60);

    doc.save("Trust-Receipt.pdf");
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h2>🔍 Verify RealityHash</h2>

      <input
        type="text"
        placeholder="Enter RealityHash here"
        value={hash}
        onChange={(e) => setHash(e.target.value.trimStart())}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          marginBottom: "1rem",
        }}
      />

      <button
        onClick={handleVerify}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Verify
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "1rem" }}>
          ❌ {error}
        </p>
      )}

      {result && (
        <div
          style={{
            marginTop: "2rem",
            backgroundColor: "#f3f3f3",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          <p><strong>✅ File Verified!</strong></p>
          <p><strong>Filename:</strong> {result.filename}</p>
          <p><strong>RealityHash:</strong> {result.reality_hash}</p>
          <p><strong>Uploaded On:</strong> {new Date(result.timestamp).toLocaleString()}</p>

          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button onClick={copyToClipboard} style={{
              padding: "0.4rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}>📋 Copy Hash</button>

            <button onClick={shareHash} style={{
              padding: "0.4rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: "#673AB7",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}>🔗 Share</button>

            <button onClick={downloadPDF} style={{
              padding: "0.4rem 1rem",
              fontSize: "0.9rem",
              backgroundColor: "#FF9800",
              color: "white",
              border: "none",
              cursor: "pointer"
            }}>📄 Download Receipt</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Verify;
