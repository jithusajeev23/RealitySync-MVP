import React, { useEffect, useState } from "react";

function Receipts() {
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/receipts")
      .then((res) => res.json())
      .then((data) => setReceipts(data))
      .catch((err) => console.error("Error fetching receipts:", err));
  }, []);

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    alert("RealityHash copied to clipboard!");
  };

  const shareHash = async (receipt) => {
    const shareData = {
      title: "RealitySync Trust Receipt",
      text: `Filename: ${receipt.filename}\nRealityHash: ${receipt.reality_hash}\nUploaded On: ${new Date(receipt.timestamp).toLocaleString()}`,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        alert("Share failed or cancelled.");
      }
    } else {
      alert("Sharing not supported on this device.");
    }
  };

  const downloadPDF = (receipt) => {
    const jsPDF = require("jspdf");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("RealitySync - Trust Receipt", 20, 20);
    doc.setFontSize(12);
    doc.text(`Filename: ${receipt.filename}`, 20, 40);
    doc.text(`RealityHash: ${receipt.reality_hash}`, 20, 50);
    doc.text(`Uploaded On: ${new Date(receipt.timestamp).toLocaleString()}`, 20, 60);
    doc.save(`TrustReceipt-${receipt.reality_hash.substring(0, 8)}.pdf`);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📂 View Trust Receipts</h2>
      {receipts.length === 0 ? (
        <p>No receipts found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Filename</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>RealityHash</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Uploaded On</th>
              <th style={{ borderBottom: "1px solid #ccc", padding: "0.5rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt.reality_hash}>
                <td style={{ padding: "0.5rem" }}>{receipt.filename}</td>
                <td style={{ padding: "0.5rem", wordBreak: "break-all" }}>{receipt.reality_hash}</td>
                <td style={{ padding: "0.5rem" }}>{new Date(receipt.timestamp).toLocaleString()}</td>
                <td style={{ padding: "0.5rem" }}>
                  <button onClick={() => copyHash(receipt.reality_hash)} style={{ marginRight: "0.5rem" }}>📋</button>
                  <button onClick={() => shareHash(receipt)} style={{ marginRight: "0.5rem" }}>🔗</button>
                  <button onClick={() => downloadPDF(receipt)}>📄</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Receipts;
