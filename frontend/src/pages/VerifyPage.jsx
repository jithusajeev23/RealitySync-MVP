// pages/VerifyPage.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCode } from "react-qrcode-logo";

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
    const canvas = await html2canvas(element, {
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("realitysync-trust-receipt.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8 text-gray-800 font-sans">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          🔎 RealitySync - Receipt Verification
        </h1>

        <input
          type="text"
          value={receiptHash}
          onChange={(e) => setReceiptHash(e.target.value)}
          placeholder="Enter Reality Hash"
          className="w-full px-4 py-2 border border-gray-400 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleVerify}
          className="w-full px-5 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition duration-200"
        >
          🔍 Verify Receipt
        </button>

        {errorMessage && (
          <p className="mt-4 text-red-600 text-center font-medium">{errorMessage}</p>
        )}

        {verificationResult && (
          <>
            <div
              ref={receiptRef}
              className="mt-10 p-6 bg-white border border-gray-300 rounded shadow-lg text-center"
            >
              <h2 className="text-2xl font-bold text-green-700 mb-4 underline">
                ✅ Digital Trust Certificate
              </h2>

              <p className="text-base mb-4">
                This document certifies that the file has been verified and timestamped
                using the RealitySync protocol.
              </p>

              <hr className="my-4" />

              <div className="text-left text-sm sm:text-base space-y-2">
                <p><strong>Filename:</strong> {verificationResult.filename}</p>
                <p><strong>Reality Hash:</strong> {verificationResult.reality_hash}</p>
                <p><strong>Timestamp:</strong> {new Date(verificationResult.timestamp).toLocaleString()}</p>
              </div>

              <div className="flex justify-center my-6">
                <QRCode
                  value={`${window.location.origin}/verify?hash=${verificationResult.reality_hash}`}
                  size={100}
                  fgColor="#000000"
                />
              </div>

              <p className="text-gray-600 italic text-sm mt-4">
                Issued by RealitySync | Proof-of-Authenticity Document
              </p>
            </div>

            <button
              onClick={handleDownloadPDF}
              className="mt-6 w-full px-5 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
            >
              📄 Download Certificate PDF
            </button>
          </>
        )}

        <Link to="/" className="block mt-6 text-blue-600 text-center underline">
          ⬅️ Back to Upload Page
        </Link>
      </div>
    </div>
  );
}

export default VerifyPage;
