import React, { useState } from "react";

const VerifyPage = () => {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://realitysync-api.onrender.com/verify/${hash}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Server error. Please try again." });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">🔍 Verify RealitySync Receipt</h1>
      <input
        className="border p-2 w-full max-w-md mb-4 rounded"
        type="text"
        placeholder="Enter reality hash"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />
      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify"}
      </button>

      {result && (
        <div className="mt-6 bg-white p-4 rounded shadow w-full max-w-md">
          {result.error ? (
            <p className="text-red-600 font-semibold">{result.error}</p>
          ) : (
            <>
              <p className="text-green-600 font-semibold">✅ Receipt Found</p>
              <p><strong>Filename:</strong> {result.filename}</p>
              <p><strong>Reality Hash:</strong> {result.reality_hash}</p>
              <p><strong>Timestamp:</strong> {result.timestamp}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
