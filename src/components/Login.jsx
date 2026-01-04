import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Existing Standard Login Logic
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'abc' && password === 'def') {
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  // DUMMY HANDLERS (To be replaced with Python API calls)
  const handleGoogleLogin = () => {
    console.log("DUMMY: Initiating Google Login...");
    // TODO: Connect to Python backend API
  };

  const handlePhoneLogin = () => {
    console.log("DUMMY: Initiating Phone Login...");
    // TODO: Connect to Python backend API
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="left-panel">
        <div className="logo-section">
          {/* Logo updated as requested */}
          <h2>Connect, Learn & Grow</h2> 
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

              {/* Divider for Social Logins */}
              <div className="divider">
                <span>OR</span>
              </div>

              {/* Alternative Login Buttons */}
              <div className="social-login-buttons">
                <button 
                  type="button" 
                  className="social-btn google-btn"
                  onClick={handleGoogleLogin}
                >
                  Sign in with Google
                </button>
                <button 
                  type="button" 
                  className="social-btn phone-btn"
                  onClick={handlePhoneLogin}
                >
                  Sign in with Phone
                </button>
              </div>
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
