import React from 'react';
import { FaHome, FaBell, FaSearch, FaUser } from 'react-icons/fa';

const Navbar = () => {
  return (
    <nav style={{
      width: '100%',
      background: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      padding: '0.5rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo/Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: 36,
          height: 36,
          background: '#6366f1',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 700,
          fontSize: 22
        }}>
          S
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.35rem', color: '#3730a3', letterSpacing: 1 }}>SkillSphere</span>
      </div>

      {/* Search Bar */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          background: '#f3f4f6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          padding: '0.25rem 1rem',
          minWidth: 250,
          maxWidth: 400,
          width: '100%'
        }}>
          <FaSearch style={{ color: '#a1a1aa', marginRight: 8 }} />
          <input
            type="text"
            placeholder="search"
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 16,
              width: '100%'
            }}
          />
        </div>
      </div>

      {/* Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <FaHome style={{ fontSize: 20, color: '#6366f1', cursor: 'pointer' }} />
        <FaBell style={{ fontSize: 20, color: '#6366f1', cursor: 'pointer' }} />
        <FaSearch style={{ fontSize: 20, color: '#6366f1', cursor: 'pointer' }} />
        <FaUser style={{ fontSize: 20, color: '#6366f1', cursor: 'pointer' }} />
      </div>
    </nav>
  );
};

export default Navbar; 