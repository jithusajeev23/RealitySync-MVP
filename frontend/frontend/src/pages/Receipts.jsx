import React, { useEffect, useState } from "react";

function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/receipts`);
        const data = await response.json();
        setReceipts(data);
      } catch (error) {
        console.error("Failed to fetch receipts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  return (
    <div>
      <h2>📂 RealitySync – All Trust Receipts</h2>
      {loading ? (
        <p>Loading...</p>
      ) : receipts.length === 0 ? (
        <p>No receipts found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Reality Hash</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt, index) => (
              <tr key={index}>
                <td>{receipt.filename}</td>
                <td>{receipt.reality_hash}</td>
                <td>{new Date(receipt.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Receipts;
