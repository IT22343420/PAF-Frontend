import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatePlan from './pages/CreatePlan';
import EditPlan from './pages/EditPlan';

function App() {
  return (
    <div style={{
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      padding: '2rem'
    }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePlan />} />
        <Route path="/edit/:id" element={<EditPlan />} />
      </Routes>
    </div>
  );
}

export default App; 