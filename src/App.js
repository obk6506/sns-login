import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Products from './components/Products';
import Banner from './components/Banner';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';

// Font Awesome 추가
const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
document.head.appendChild(link);

// Google Fonts 추가
const fontLink = document.createElement('link');
fontLink.rel = 'stylesheet';
fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
document.head.appendChild(fontLink);

// 글로벌 스타일
const globalStyle = {
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  fontFamily: "'Poppins', sans-serif",
  color: '#333',
  lineHeight: 1.6,
  backgroundColor: '#fff'
};

// 스타일 적용
const applyGlobalStyle = () => {
  document.body.style.margin = globalStyle.margin;
  document.body.style.padding = globalStyle.padding;
  document.body.style.boxSizing = globalStyle.boxSizing;
  document.body.style.fontFamily = globalStyle.fontFamily;
  document.body.style.color = globalStyle.color;
  document.body.style.lineHeight = globalStyle.lineHeight;
  document.body.style.backgroundColor = globalStyle.backgroundColor;
};

function App() {
  // 컴포넌트 마운트 시 글로벌 스타일 적용
  React.useEffect(() => {
    applyGlobalStyle();
  }, []);

  return (
    <>
      <Header />
      <Hero />
      <Categories />
      <Products />
      <Banner />
      <Newsletter />
      <Footer />
    </>
  );
}

export default App;