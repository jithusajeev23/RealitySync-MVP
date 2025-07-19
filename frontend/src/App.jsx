import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import UploadPage from './pages/UploadPage';
import VerifyPage from './pages/VerifyPage';
import HomePage from './pages/HomePage'; // ✅ Add this line

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />         {/* ✅ Home route */}
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/verify" element={<VerifyPage />} />
      </Routes>
    </Router>
  );
}

export default App;
