import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; 

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'abc' && password === 'def') {
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="left-panel">
        <div className="logo-section">
          {/* Logo Placeholder */}
          <h2 style={{color: '#333', fontWeight: 'bold'}}>MY LOGO</h2> 
        </div>

        <div className="form-wrapper">
          <div className="form-content">
            <h2>Welcome Back</h2>
            <p className="subtitle">Please enter your details to sign in.</p>
            
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Username</label>
                <input 
                  type="text" 
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="error-msg">{error}</p>}

              <button type="submit" className="login-btn">Sign in</button>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="right-panel">
        <div className="overlay-text">
          <h3>Connecting People</h3>
          <p>Building bridges across the world.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
