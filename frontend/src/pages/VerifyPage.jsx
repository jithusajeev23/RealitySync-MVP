import React, { useState } from "react";

const VerifyPage = () => {
  const [hashInput, setHashInput] = useState("");
  const [hashResult, setHashResult] = useState(null);
  const [loadingHash, setLoadingHash] = useState(false);

  const handleHashVerify = async () => {
    setLoadingHash(true);
    setHashResult(null);

    const cleanedHash = hashInput.replace(/^trust:\/\//, "");

    try {
      const response = await fetch(
        `https://realitysync-backend.onrender.com/verify?hash=${cleanedHash}`
      );
      const data = await response.json();
      setHashResult(data);
    } catch (err) {
      setHashResult({ error: "Server error. Please try again." });
    }

    setLoadingHash(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">🔍 Verify RealitySync Hash</h1>

      {/* Hash Input */}
      <input
        className="border p-2 w-full max-w-md mb-4 rounded"
        type="text"
        placeholder="Enter reality hash (e.g., trust://...)"
        value={hashInput}
        onChange={(e) => setHashInput(e.target.value)}
      />

      {/* Verify Button */}
      <button
        onClick={handleHashVerify}
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        disabled={loadingHash}
      >
        {loadingHash ? "Verifying Hash..." : "Verify Hash"}
      </button>

      {/* Results */}
      {hashResult && (
        <div className="mt-6 bg-white p-4 rounded shadow w-full max-w-md">
          {hashResult.error ? (
            <p className="text-red-600 font-semibold">{hashResult.error}</p>
          ) : (
            <>
              <p className="text-green-600 font-semibold">✅ Receipt Found</p>
              <p><strong>Filename:</strong> {hashResult.filename}</p>
              <p><strong>Reality Hash:</strong> trust://{hashInput.replace(/^trust:\/\//, '')}</p>
              <p><strong>Timestamp:</strong> {hashResult.timestamp}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
