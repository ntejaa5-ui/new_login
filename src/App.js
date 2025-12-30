import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/home/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root URL to Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
