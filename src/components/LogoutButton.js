import React from 'react';

const LogoutButton = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      style={{
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        marginTop: '20px'
      }}
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;