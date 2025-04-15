import React from 'react';
import './Profile.css';

const Profile = ({ user }) => {
  return (
    <div className="user-profile">
      <img 
        src={user.picture} 
        alt={user.name} 
        className="profile-image" 
      />
      <span className="profile-name">{user.name}</span>
    </div>
  );
};

export default Profile;