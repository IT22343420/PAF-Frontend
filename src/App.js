import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatePlan from './pages/CreatePlan';
import EditPlan from './pages/EditPlan';
import SinglePlanView from './pages/SinglePlanView';
import Navbar from './components/Navbar';

function App() {
  return (
    <div style={{
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      padding: '2rem 0 0 0'
    }}>
      <Navbar />
      <div style={{ padding: '2rem 0 0 0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePlan />} />
          <Route path="/edit/:id" element={<EditPlan />} />
          <Route path="/view/:id" element={<SinglePlanView />} />
        </Routes>
      </div>
    </div>
  );
}

export default App; 