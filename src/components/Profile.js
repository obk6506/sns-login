import React from 'react';
import styled from 'styled-components'; 

const UserProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover; /* 이미지가 영역에 맞게 잘리거나 채워지도록 함 */
`;

const ProfileName = styled.span`
  font-size: 14px;
  font-weight: 500;
  /* 필요하다면 추가적인 텍스트 스타일링 */
  color: #333; /* 예시: 텍스트 색상 */
`;

const Profile = ({ user }) => {
  
  if (!user) {
    return null; 
  }

  return (
    <UserProfileContainer>
      <ProfileImage
        src={user.picture}
        alt={user.name} 
      />
      <ProfileName>{user.name}</ProfileName>
    </UserProfileContainer>
  );
};

export default Profile;