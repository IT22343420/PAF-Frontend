// src/pages/ClaimBadges.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';
import SideNav from './SideNav';
import { FaArrowLeft } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ClaimBadges = () => {
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState(null);

  const fetchBadges = async () => {
    try {
      const data = await api.getAllBadges();
      setBadges(data);
    } catch (err) {
      console.error('Failed to fetch badges:', err);
      setError('Failed to load badges. Please try again later.');
    }
  };

  useEffect(() => {
    fetchBadges();
  }, []);

  const handleClaim = async (badgeId) => {
    try {
      await api.claimBadge(badgeId);
      toast.success('Badge claimed successfully!');
      // Refresh badges after claiming
      fetchBadges();
    } catch (error) {
      console.error('Error claiming badge:', error);
      toast.error('Failed to claim badge. Please try again.');
    }
  };

  return (
    <div className="flex bg-[#f5f6fa] min-h-screen">
      <SideNav />
      <div className="flex-1 p-6 overflow-y-auto">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        
        <Link 
          to="/skillbadges" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#4f46e5',  
            textDecoration: 'none',
          }}
        >
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Back to Skill Badges
        </Link>

        <div className="flex flex-col items-center min-h-screen p-6 bg-[#f5f6fa]">
          <h1 className="text-2xl font-bold text-indigo-700 mb-4">Claim My Badges</h1>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <div key={badge.id || badge._id} className="p-4 bg-white rounded shadow-md">
                <h2 className="text-xl font-semibold text-indigo-700">{badge.name}</h2>
                <p className="text-gray-600 mt-2">{badge.description}</p>
                <div className="mt-4">
                  {badge.claimed ? (
                    <span className="bg-green-300 text-white px-4 py-2 rounded">Claimed</span>
                  ) : (
                    <button
                      onClick={() => handleClaim(badge.id || badge._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                      Claim
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );

};

export default ClaimBadges;
