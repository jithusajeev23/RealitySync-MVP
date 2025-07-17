import { useState } from "react";

function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setUploading(true);
    setMessage("Uploading...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://realitysync-backend.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ Uploaded successfully! Trust Receipt: ${data.trustReceipt}`);
      } else {
        setMessage(`❌ Upload failed: ${data.error || "Unknown error"}`);
      }
    } catch (err) {
      setMessage("❌ Upload failed: Network error");
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
        {message && <p className="mt-4 text-sm">{message}</p>}
      </div>
    </div>
  );
}

export default UploadPage;
