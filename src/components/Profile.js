import React from 'react';

const Profile = ({ user }) => {
  return (
    <div style={{ textAlign: 'center' }}>
      {user.picture && (
        <img
          src={user.picture}
          alt="프로필 이미지"
          style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            marginBottom: '20px'
          }}
        />
      )}
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

export default Profile;