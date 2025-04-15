import React from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const FooterContainer = styled.footer`
  border-top: 1px solid #E6E6E6;
  padding-top: 60px;
  margin-bottom: 30px;
`;

const FooterTop = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 30px;
  }
`;

const FooterLogo = styled.div`
  h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    color: #4A4A4A;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 60px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 30px;
  }
`;

const LinkGroup = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    font-size: 14px;
    color: #4A4A4A;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #C1DCDC;
    }
  }
`;

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #E6E6E6;

  @media (max-width: 576px) {
    flex-direction: column;
    gap: 20px;
  }
`;

const Copyright = styled.p`
  font-size: 14px;
  color: #4A4A4A;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const SocialLink = styled.a`
  font-size: 18px;
  color: #1E1E1E;
  transition: color 0.3s;

  &:hover {
    color: #C1DCDC;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterTop>
        <FooterLogo>
          <h2>GREENMIND</h2>
          <p>We help you find your dream plant</p>
        </FooterLogo>
        <FooterLinks>
          <LinkGroup>
            <h3>Information</h3>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Product</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </LinkGroup>
          <LinkGroup>
            <h3>Company</h3>
            <ul>
              <li><a href="#">Community</a></li>
              <li><a href="#">Career</a></li>
              <li><a href="#">Our Story</a></li>
            </ul>
          </LinkGroup>
          <LinkGroup>
            <h3>Contact</h3>
            <ul>
              <li><a href="#">Getting Started</a></li>
              <li><a href="#">Pricing</a></li>
              <li><a href="#">Resources</a></li>
            </ul>
          </LinkGroup>
        </FooterLinks>
      </FooterTop>
      <FooterBottom>
        <Copyright>© 2025 GREENMIND. All rights reserved.</Copyright>
        <SocialLinks>
          <SocialLink href="#"><FaFacebookF /></SocialLink>
          <SocialLink href="#"><FaTwitter /></SocialLink>
          <SocialLink href="#"><FaInstagram /></SocialLink>
        </SocialLinks>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
