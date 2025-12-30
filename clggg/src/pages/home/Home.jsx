import React from 'react';

const Home = () => {
  return (
    <div style={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      flexDirection: 'column',
      fontFamily: 'sans-serif'
    }}>
      <h1>Welcome Home</h1>
      <p>Login Successful!</p>
    </div>
  );
};

export default Home;
