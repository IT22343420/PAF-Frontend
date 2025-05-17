import React, { useEffect, useState } from 'react';
import SideNav from './SideNav';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const SkillBadges = () => {
  const [claimedBadges, setClaimedBadges] = useState([]);
  const [error, setError] = useState(null);

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
        {/* Heading and button container - outside white box */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mb-4">
          <h1
            style={{
              fontSize: '30px',
              fontWeight: '700',
              color: 'rgba(55, 48, 163, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            🏅 My Skill Badges
          </h1>

          <Link
          to="/badges"
          className="text-white px-4 py-2 rounded transition no-underline"
          style={{
            backgroundColor: 'rgba(55, 48, 163, 1)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(44, 39, 130, 1)'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(55, 48, 163, 1)'}
        >
          Claim New Badges
        </Link>

        </div>

        {/* White content box with badges list */}
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {claimedBadges.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No badges earned yet. Keep learning to earn your first badge!
            </p>
          ) : (
            <ul className="space-y-4 text-sm">
              {claimedBadges.map((badge, index) => (
                <li
                  key={index}
                  className="border-l-5 border-indigo-500 bg-indigo-50 px-4 py-3 rounded shadow-sm"
                >
                  <h5 className="text-base font-semibold text-indigo-800"
                  style={{color: 'rgba(55, 48, 163, 1)'}}>{badge.name}</h5>
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
