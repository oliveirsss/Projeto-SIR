import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <header style={{
      backgroundColor: 'var(--header-bg)',
      color: 'white',
      padding: '1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <button className="icon-btn" style={{ color: 'white', fontSize: '1.5rem' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      <h1 style={{
        fontSize: '1.2rem',
        fontWeight: 500,
        flex: 1,
        textAlign: 'center',
        margin: '0 10px',
        cursor: 'pointer'
      }} onClick={() => navigate('/')}>
        {user?.name || 'UniEvents'}
      </h1>

      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: 'white',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
    </header>
  );
};

export default Header;
