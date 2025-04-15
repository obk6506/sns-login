import React from 'react';
import styled from 'styled-components';

const OfferSection = styled.section`
  background-color: #C1DCDC;
  border-radius: 8px;
  padding: 60px;
  margin-bottom: 60px;
  text-align: center;

  @media (max-width: 576px) {
    padding: 30px;
  }
`;

const OfferTitle = styled.h2`
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
`;

const OfferDescription = styled.p`
  font-size: 18px;
  margin-bottom: 30px;
`;

const ShopNowButton = styled.button`
  background-color: #FFFFFF;
  color: #1E1E1E;
  border: none;
  padding: 12px 30px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #F0F0F0;
  }
`;

const SpecialOffer = () => {
  return (
    <OfferSection>
      <OfferTitle>Special Offer</OfferTitle>
      <OfferDescription>Get 20% off on selected plants</OfferDescription>
      <ShopNowButton>Shop Now</ShopNowButton>
    </OfferSection>
  );
};

export default SpecialOffer;
