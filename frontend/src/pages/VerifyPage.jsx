import React, { useState } from "react";

const VerifyPage = () => {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!hash.trim()) return;

    setLoading(true);

    const cleanedHash = hash.replace(/^trust:\/\//, "");

    try {
      const response = await fetch(
        `https://realitysync-backend.onrender.com/verify?hash=${cleanedHash}`
      );
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Server error. Please try again." });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🔍 Verify RealitySync Receipt</h1>

      {/* Input Field */}
      <input
        className="border border-gray-400 p-2 w-full max-w-md mb-4 rounded"
        type="text"
        placeholder="Enter reality hash (e.g., trust://...)"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
      />

      {/* SEPARATE Verify Button */}
      <button
        onClick={handleVerify}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-6"
        disabled={loading}
      >
        {loading ? "Verifying..." : "🔍 Verify Hash"}
      </button>

      {/* Result Box */}
      {result && (
        <div className="bg-white p-4 rounded shadow w-full max-w-md">
          {result.error ? (
            <p className="text-red-600 font-semibold">{result.error}</p>
          ) : (
            <>
              <p className="text-green-600 font-semibold">✅ Receipt Found</p>
              <p><strong>Filename:</strong> {result.filename}</p>
              <p><strong>Reality Hash:</strong> trust://{hash.replace(/^trust:\/\//, "")}</p>
              <p><strong>Timestamp:</strong> {result.timestamp}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
