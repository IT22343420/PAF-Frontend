import React, { useEffect, useState } from 'react';
import SideNav from './SideNav';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { FaArrowLeft } from 'react-icons/fa';
import Confetti from 'react-confetti';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SkillBadges = () => {
  const location = useLocation();
  const [claimedBadges, setClaimedBadges] = useState([]);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.showConfetti) {
      setShowConfetti(true);
      toast.success('Welcome to your badges! 🎉');
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [location]);

  useEffect(() => {
    const fetchClaimedBadges = async () => {
      try {
        const allBadges = await api.getAllBadges();
        const claimedOnly = allBadges.filter(badge => badge.claimed === true);
        setClaimedBadges(claimedOnly);
      } catch (err) {
        console.error('Failed to fetch claimed badges:', err);
        setError('Unable to load badges at the moment.');
      }
    };

    fetchClaimedBadges();
  }, []);

  return (
    <div className="flex bg-[#f5f6fa] min-h-screen">
      <SideNav />
      <div className="flex-1 p-6 overflow-y-auto">
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        
        {showConfetti && (
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={200}
            gravity={0.3}
          />
        )}

        {/* Header + Button aligned to white box width */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-indigo-700"
          style={{ 
                  fontSize: '30px',
                  fontWeight: '700' // Bold plan name
                }}>
            
            🏅 My Skill Badges
          </h1>
          <Link
            to="/badges"
            style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#4338ca', // Darker indigo
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '4px',
                    fontWeight: '500'
                  }}
          >
            Claim New Badges
          </Link>
        </div>

        {/* White card */}
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
          {error && (
            <p className="text-red-500 mb-4">{error}</p>
          )}

          {claimedBadges.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No badges earned yet. Keep learning to earn your first badge!
            </p>
          ) : (
            <ul className="space-y-6">
              {claimedBadges.map((badge, index) => (
                <li
                  key={index}
                  className="border-l-4 border-indigo-500 bg-indigo-50 px-4 py-3 rounded shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-indigo-800">{badge.name}</h3>
                  <p className="text-gray-700">{badge.description}</p>
                  <p className="text-green-600 font-medium mt-1">🎉 Congratulations!</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillBadges;
