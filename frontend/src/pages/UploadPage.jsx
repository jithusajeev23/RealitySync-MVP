import { useState } from "react";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [trustReceipt, setTrustReceipt] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setTrustReceipt("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setUploading(true);
    setTrustReceipt("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://realitysync-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setTrustReceipt(data.trustReceipt);
      } else {
        setError(`❌ Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      setError("❌ Upload failed: Network error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">RealitySync</h1>
      <div className="bg-white shadow p-6 rounded w-full max-w-md">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 block w-full"
        />
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        {/* ✅ Show Trust Receipt with clickable link */}
        {trustReceipt && (
          <div className="text-green-600 mt-4 text-sm">
            ✅ Uploaded successfully! <br />
            Trust Receipt:{" "}
            <a
              href={`/verify?hash=${trustReceipt}`}
              className="text-blue-600 underline break-all"
            >
              {trustReceipt}
            </a>
          </div>
        )}

        {/* ❌ Show Error */}
        {error && <p className="mt-4 text-red-600 text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default UploadPage;
