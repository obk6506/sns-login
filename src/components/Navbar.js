import React from 'react';
import styled from 'styled-components';
import { FaSearch, FaShoppingCart } from 'react-icons/fa';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #E6E6E6;
`;

const Logo = styled.div`
  h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1E1E1E;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 30px;

  @media (max-width: 576px) {
    display: none;
  }
`;

const NavLink = styled.a`
  font-size: 16px;
  font-weight: 500;
  color: #1E1E1E;
  text-decoration: none;
  transition: color 0.3s;

  &.active, &:hover {
    color: #C1DCDC;
  }
`;

const NavIcons = styled.div`
  display: flex;
  gap: 20px;
`;

const IconLink = styled.a`
  font-size: 18px;
  color: #1E1E1E;
  transition: color 0.3s;

  &:hover {
    color: #C1DCDC;
  }
`;

const UserInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProfilePic = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #C1DCDC;
`;

const Navbar = ({ user, onLoginSuccess, onLogout }) => {
  return (
    <NavbarContainer>
      <Logo>
        <h1>GREENMIND</h1>
      </Logo>
      <NavLinks>
        <NavLink href="#" className="active">Home</NavLink>
        <NavLink href="#">Products</NavLink>
        <NavLink href="#">Contacts</NavLink>
        <NavLink href="#">About Us</NavLink>
      </NavLinks>
      <NavIcons>
        <IconLink href="#"><FaSearch /></IconLink>
        <IconLink href="#"><FaShoppingCart /></IconLink>
        {user ? (
          <UserInfoContainer>
            {user.picture && (
              <ProfilePic src={user.picture} alt="Profile" title={user.name}/>
            )}
            <LogoutButton onLogout={onLogout} />
          </UserInfoContainer>
        ) : (
          <LoginButton onLoginSuccess={onLoginSuccess} />
        )}
      </NavIcons>
    </NavbarContainer>
  );
};

export default Navbar;
