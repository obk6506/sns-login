import React from 'react';
import styled from 'styled-components';
import { FaArrowRight } from 'react-icons/fa';
import plant1 from '../assets/plant1.png';
import plant2 from '../assets/plant2.png';
import plant3 from '../assets/plant3.png';
import plant4 from '../assets/plant4.png';

const BestsellersSection = styled.section`
  margin-bottom: 60px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
`;

const ViewAll = styled.a`
  font-size: 16px;
  font-weight: 500;
  color: #1E1E1E;
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: none;
  transition: color 0.3s;

  &:hover {
    color: #C1DCDC;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.div`
  height: 250px;
  background-color: #F5F5F5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const ProductInfo = styled.div`
  padding: 15px 0;
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  font-weight: 500;
  color: #4A4A4A;
`;

const products = [
  {
    id: 1,
    name: 'Sansevieria',
    price: '$24.99',
    image: plant1
  },
  {
    id: 2,
    name: 'Monstera',
    price: '$29.99',
    image: plant2
  },
  {
    id: 3,
    name: 'Pothos',
    price: '$19.99',
    image: plant3
  },
  {
    id: 4,
    name: 'Calathea',
    price: '$34.99',
    image: plant4
  }
];

const Bestsellers = () => {
  return (
    <BestsellersSection>
      <SectionHeader>
        <SectionTitle>Best Selling Plants</SectionTitle>
        <ViewAll href="#">
          View All <FaArrowRight />
        </ViewAll>
      </SectionHeader>
      <ProductGrid>
        {products.map(product => (
          <ProductCard key={product.id}>
            <ProductImage>
              <img src={product.image} alt={product.name} />
            </ProductImage>
            <ProductInfo>
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price}</ProductPrice>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductGrid>
    </BestsellersSection>
  );
};

export default Bestsellers;
