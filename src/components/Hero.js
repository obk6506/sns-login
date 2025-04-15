import React from 'react';
import styled from 'styled-components';
import heroImage from '../assets/hero-image.png';

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  padding: 60px 0;
  gap: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const HeroContent = styled.div`
  flex: 1;
`;

const HeroTitle = styled.h2`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  line-height: 1.2;
`;

const HeroDescription = styled.p`
  font-size: 18px;
  color: #4A4A4A;
  margin-bottom: 30px;
`;

const ShopNowButton = styled.button`
  background-color: #C1DCDC;
  color: #1E1E1E;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #A3C9C9;
  }
`;

const HeroImageContainer = styled.div`
  flex: 1;
  
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

const Hero = () => {
  return (
    <HeroSection>
      <HeroContent>
        <HeroTitle>Plants for your interior</HeroTitle>
        <HeroDescription>Find perfect plants for your home, office and garden</HeroDescription>
        <ShopNowButton>Shop Now</ShopNowButton>
      </HeroContent>
      <HeroImageContainer>
        <img src={heroImage} alt="식물 이미지" />
      </HeroImageContainer>
    </HeroSection>
  );
};

export default Hero;
