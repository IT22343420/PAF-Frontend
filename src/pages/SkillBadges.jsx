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

  const mainColor = 'rgba(55,48,163,1)';

  return (
    <div className="flex bg-[#f5f6fa] min-h-screen">
      <SideNav />
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow">
          <h1
            style={{
              fontSize: '30px',
              fontWeight: 700,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: mainColor,
            }}
          >
            🏅 My Skill Badges
          </h1>

          <Link
            to="/badges"
            className="mb-4 inline-block px-5 py-2 rounded text-white transition"
            style={{ backgroundColor: mainColor }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(45,39,140,1)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = mainColor)}
          >
            Claim New Badges
          </Link>

          {error && (
            <p className="mb-4 text-red-500">{error}</p>
          )}

          {claimedBadges.length === 0 ? (
            <p
              className="text-center py-10 text-gray-500 text-sm"
            >
              No badges earned yet. Keep learning to earn your first badge!
            </p>
          ) : (
            <ul className="space-y-4">
              {claimedBadges.map((badge, index) => (
                <li
                  key={index}
                  className="border-l-4 px-3 py-2 rounded shadow-sm"
                  style={{ borderColor: mainColor, backgroundColor: 'rgba(55,48,163,0.1)' }}
                >
                  <h3
                    className="font-semibold"
                    style={{ color: 'rgba(55,48,163,0.9)', fontSize: '0.875rem' /* smaller */ }}
                  >
                    {badge.name}
                  </h3>
                  <p className="text-gray-700 text-xs">{badge.description}</p>
                  <p
                    className="font-medium mt-1 text-green-600 text-xs"
                  >
                    🎉 Congratulations!
                  </p>
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
