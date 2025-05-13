// src/pages/ClaimBadges.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

const ClaimBadges = () => {
  const [badges, setBadges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const data = await api.getAllBadges();
        setBadges(data);
      } catch (err) {
        console.error('Failed to fetch badges:', err);
        setError('Failed to load badges. Please try again later.');
      }
    };

    fetchBadges();
  }, []);

  const handleClaim = async (badgeId) => {
    try {
      await api.claimBadge(badgeId);
      setBadges((prevBadges) =>
        prevBadges.map((badge) =>
          badge.id === badgeId || badge._id === badgeId // support both id and _id
            ? { ...badge, claimed: true }
            : badge
        )
      );
      alert('Badge claimed successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to claim badge. Try again!');
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-6 bg-[#f5f6fa]">
      <h1 className="text-2xl font-bold text-indigo-700 mb-4">All Available Badges</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <div key={badge.id || badge._id} className="p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-semibold text-indigo-700">{badge.name}</h2>
            <p className="text-gray-600 mt-2">{badge.description}</p>
            <div className="mt-4">
              {badge.claimed ? (
                <span className="bg-green-500 text-white px-4 py-2 rounded">Claimed</span>
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
      <Link to="/skillbadges" className="mt-6 text-blue-600">Go Back</Link>
    </div>
  );
};

export default ClaimBadges;
