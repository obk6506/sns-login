import React from 'react';
import styled from 'styled-components';
import { FaArrowRight, FaSun, FaCloudSun, FaTint } from 'react-icons/fa';

const CategoriesSection = styled.section`
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

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.div`
  background-color: #F9F9F9;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  transition: background-color 0.3s;

  &:hover {
    background-color: #C1DCDC;
  }
`;

const CategoryIcon = styled.div`
  font-size: 36px;
  color: #1E1E1E;
  margin-bottom: 15px;
`;

const CategoryName = styled.h3`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 5px;
`;

const CategoryCount = styled.p`
  font-size: 14px;
  color: #4A4A4A;
`;

const categories = [
  {
    id: 1,
    name: 'Indoor Plants',
    count: '120 Plants',
    icon: <FaSun />
  },
  {
    id: 2,
    name: 'Outdoor Plants',
    count: '90 Plants',
    icon: <FaCloudSun />
  },
  {
    id: 3,
    name: 'Succulents',
    count: '60 Plants',
    icon: <FaTint />
  }
];

const Categories = () => {
  return (
    <CategoriesSection>
      <SectionHeader>
        <SectionTitle>Plant Categories</SectionTitle>
        <ViewAll href="#">
          View All <FaArrowRight />
        </ViewAll>
      </SectionHeader>
      <CategoryGrid>
        {categories.map(category => (
          <CategoryCard key={category.id}>
            <CategoryIcon>{category.icon}</CategoryIcon>
            <CategoryName>{category.name}</CategoryName>
            <CategoryCount>{category.count}</CategoryCount>
          </CategoryCard>
        ))}
      </CategoryGrid>
    </CategoriesSection>
  );
};

export default Categories;
