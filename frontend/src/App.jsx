import UploadPage from "./pages/UploadPage";

function App() {
  return <UploadPage />;
}

export default App;

import VerifyPage from "./pages/VerifyPage";

// Add inside <Routes> block
<Route path="/verify" element={<VerifyPage />} />
