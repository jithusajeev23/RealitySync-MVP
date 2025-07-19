// src/pages/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
          🔐 Welcome to <span className="text-blue-600">RealitySync</span>
        </h1>
        <p className="text-lg text-gray-600 mb-10">
          RealitySync lets you prove the originality and trust of your digital files. Instantly upload, verify, and download tamper-proof receipts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/upload">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
              📤 Upload File
            </button>
          </Link>
          <Link to="/verify">
            <button className="px-6 py-3 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-900 transition">
              🔎 Verify Receipt
            </button>
          </Link>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          Made with ❤️ for truth & trust · © {new Date().getFullYear()} RealitySync
        </div>
      </div>
    </div>
  );
}

export default HomePage;
