import React from 'react';
import './Categories.css';

const Categories = () => {
  const categories = [
    { id: 1, name: 'Indoor Plants', count: 120 },
    { id: 2, name: 'Outdoor Plants', count: 85 },
    { id: 3, name: 'Succulents', count: 45 },
    { id: 4, name: 'Accessories', count: 65 }
  ];

  return (
    <section className="categories section-padding" id="categories">
      <div className="container">
        <h2 className="section-title">Plant Categories</h2>
        <div className="categories-grid">
          {categories.map(category => (
            <div className="category-card" key={category.id}>
              <h3>{category.name}</h3>
              <p>{category.count} Products</p>
              <a href={`#${category.name.toLowerCase().replace(' ', '-')}`} className="category-link">
                Explore <i className="fas fa-arrow-right"></i>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;