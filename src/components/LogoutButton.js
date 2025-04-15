import React from 'react';

const LogoutButton = ({ onLogout }) => {
  return (
    <button
      onClick={onLogout}
      className="btn btn-outline logout-btn"
    >
      로그아웃
    </button>
  );
};

export default LogoutButton;