import React from 'react';
import ProductCard from './ProductCard';
import plant1 from '../assets/plant1.png';
import plant2 from '../assets/plant2.png';
import plant3 from '../assets/plant3.png';
import plant4 from '../assets/plant4.png';
import './FeaturedProducts.css';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: 'Snake Plant',
      price: 29.99,
      image: plant1,
      category: 'Indoor'
    },
    {
      id: 2,
      name: 'Monstera Deliciosa',
      price: 49.99,
      image: plant2,
      category: 'Indoor'
    },
    {
      id: 3,
      name: 'Fiddle Leaf Fig',
      price: 59.99,
      image: plant3,
      category: 'Indoor'
    },
    {
      id: 4,
      name: 'Peace Lily',
      price: 39.99,
      image: plant4,
      category: 'Indoor'
    }
  ];

  return (
    <section className="featured-products section-padding" id="shop">
      <div className="container">
        <h2 className="section-title">Featured Plants</h2>
        <div className="product-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="view-all">
          <button className="btn btn-outline">View All Plants</button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;