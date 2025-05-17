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
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">
            🏅 My Skill Badges
          </h1>

        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
  <div className="flex justify-end">
    <Link
      to="/badges"
      style={{
        backgroundColor: '#4338ca',
        color: 'white',
        padding: '0.5rem 1rem', // py-2 px-4
        borderRadius: '0.25rem', // rounded
        transition: 'background-color 0.2s ease-in-out',
        display: 'inline-block',
        marginBottom: '1rem',
      }}
    >
      Claim New Badges
    </Link>
  </div>

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
