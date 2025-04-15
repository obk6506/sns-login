import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Bestsellers from './components/Bestsellers';
import Categories from './components/Categories';
import SpecialOffer from './components/SpecialOffer';
import Footer from './components/Footer';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const GlobalStyles = styled.div`
  font-family: 'Poppins', sans-serif;
  color: #1E1E1E;
  background-color: #FFFFFF;
  line-height: 1.5;
`;

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (response) => {
    const token = response.credential;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    const decoded = JSON.parse(jsonPayload);
    setUser(decoded);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <GlobalStyles>
      <Container>
        <Navbar 
          user={user}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
        {/* {user ? (
          <>
            <Profile user={user} />
            <LogoutButton onLogout={handleLogout} />
          </>
        ) : (
          <LoginButton onLoginSuccess={handleLoginSuccess} />
        )} */}
        <Hero />
        <Bestsellers />
        <Categories />
        <SpecialOffer />
        <Footer />
      </Container>
    </GlobalStyles>
  );
}

export default App;
