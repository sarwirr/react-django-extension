import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Register';
import Dashboard from './pages/Dashboard';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    
    <AuthProvider>
      <Router>
          <div className="App">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
      </Router>
    </AuthProvider>
    
  );
}

export default App;
