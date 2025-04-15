import React from 'react';
import styled from 'styled-components';
import { FaSignOutAlt } from 'react-icons/fa';

const StyledLogoutButton = styled.button`
  background: none; // 배경 없음
  border: none; // 테두리 없음
  color: #1E1E1E; // 기본 텍스트/아이콘 색상
  font-size: 16px; // Navbar 텍스트/아이콘 크기와 유사하게 조정
  font-family: inherit; // 부모 요소 폰트 상속
  cursor: pointer;
  padding: 0; // 내부 패딩 제거 (아이콘/텍스트 주변 간격은 gap으로 조절)
  display: flex;
  align-items: center;
  gap: 5px; // 아이콘과 텍스트 사이 간격 (텍스트만 사용할 경우 불필요)
  transition: color 0.3s;

  &:hover {
    color: #C1DCDC; // 호버 시 색상 변경 (테마 색상)
  }
`;

const LogoutButton = ({ onLogout }) => {
  return (
    <StyledLogoutButton onClick={onLogout}>
      <FaSignOutAlt /> 로그아웃
    </StyledLogoutButton>
  );
};

export default LogoutButton;