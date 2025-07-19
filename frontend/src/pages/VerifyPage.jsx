// pages/VerifyPage.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function VerifyPage() {
  const [searchParams] = useSearchParams();
  const defaultHash = searchParams.get("hash") || "";

  const [receiptHash, setReceiptHash] = useState(defaultHash);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const receiptRef = useRef();

  useEffect(() => {
    if (defaultHash) {
      handleVerify();
    }
    // eslint-disable-next-line
  }, []);

  const handleVerify = async () => {
    if (!receiptHash) {
      setErrorMessage("Please enter a receipt hash.");
      return;
    }

    try {
      const response = await axios.get(
        `https://realitysync-backend.onrender.com/verify?hash=${receiptHash}`
      );
      setVerificationResult(response.data);
      setErrorMessage("");
    } catch (error) {
      console.error("Verification error:", error);
      setErrorMessage("❌ Receipt not found.");
      setVerificationResult(null);
    }
  };

  const handleDownloadPDF = async () => {
    const element = receiptRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("trust-receipt.pdf");
  };

  return (
    <div className="min-h-screen p-6 bg-white text-black font-mono">
      <h1 className="text-2xl font-bold mb-4">RealitySync - Verify Receipt</h1>
      <input
        type="text"
        value={receiptHash}
        onChange={(e) => setReceiptHash(e.target.value)}
        placeholder="Enter receipt hash"
        className="w-full px-3 py-2 border border-gray-400 rounded mb-4"
      />
      <button
        onClick={handleVerify}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Verify Receipt
      </button>

      {errorMessage && <p className="mt-4 text-red-600">{errorMessage}</p>}

      {verificationResult && (
        <div ref={receiptRef} className="mt-6 border p-4 rounded bg-gray-100">
          <p className="text-green-600 font-bold">✅ Receipt Found</p>
          <p>
            <strong>Filename:</strong> {verificationResult.filename}
          </p>
          <p>
            <strong>Reality Hash:</strong> {verificationResult.reality_hash}
          </p>
          <p>
            <strong>Timestamp:</strong> {verificationResult.timestamp}
          </p>
        </div>
      )}

      {verificationResult && (
        <button
          onClick={handleDownloadPDF}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          📄 Download Receipt as PDF
        </button>
      )}

      <Link to="/" className="block mt-6 text-blue-600 underline">
        ⬅️ Back to Upload Page
      </Link>
    </div>
  );
}

export default VerifyPage;
