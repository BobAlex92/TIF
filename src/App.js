import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Ensure Routes is imported
import CryptoList from './crypto_list';
import LandingPage from './LandingPage';

function App() {
  return (
    <Router>
      <Routes>
          <Route path="/crypto_list" element={<CryptoList />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
