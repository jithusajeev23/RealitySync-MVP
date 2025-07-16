import React, { useState } from "react";

function Verify() {
  const [hash, setHash] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    if (!hash.trim()) {
      setMessage("Please enter a hash to verify.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify/${hash}`);
      const result = await response.json();

      if (response.ok) {
        setReceipt(result);
        setMessage("✅ Verified successfully.");
      } else {
        setReceipt(null);
        setMessage(result.error || "Verification failed.");
      }
    } catch (error) {
      setReceipt(null);
      setMessage("Error connecting to server.");
    }
  };

  return (
    <div>
      <h2>🔍 Verify Reality Hash</h2>
      <input
        type="text"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        placeholder="Enter Reality Hash"
        style={{ width: "300px" }}
      />
      <button onClick={handleVerify}>Verify</button>
      <p>{message}</p>

      {receipt && (
        <div>
          <h3>🔒 Verified Receipt</h3>
          <p><strong>Filename:</strong> {receipt.filename}</p>
          <p><strong>Reality Hash:</strong> {receipt.reality_hash}</p>
          <p><strong>Timestamp:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}

export default Verify;
