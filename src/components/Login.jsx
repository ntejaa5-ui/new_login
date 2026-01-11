import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const API_URL ='http://localhost:8080';

  async function callSignInAPI(payload) {
    const res = await fetch(`${API_URL}/api/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Map local username/password to a payload your backend expects.
      const payload = {
        firebase_uid: `local-${username}`, // or real uid if available
        email: `${username}@example.com`,
        display_name: username,
        photo_url: null
      };
      await callSignInAPI(payload);
      navigate('/home');
    } catch (err) {
      setError('Sign-in failed: ' + (err.message || 'unknown error'));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Replace with real Google OAuth flow to get firebase_uid/email/display_name/photo_url
      const googleUser = {
        firebase_uid: 'google-uid-123',
        email: 'user@example.com',
        display_name: 'Google User',
        photo_url: 'https://example.com/avatar.png'
      };
      await callSignInAPI(googleUser);
      navigate('/home');
    } catch (err) {
      setError('Google sign-in failed');
      console.error(err);
    }
  };

  const handlePhoneLogin = async () => {
    try {
      // Replace with real phone auth flow to get firebase_uid/email/display_name/photo_url
      const phoneUser = {
        firebase_uid: 'phone-uid-123',
        email: null,
        display_name: 'Phone User',
        photo_url: null
      };
      await callSignInAPI(phoneUser);
      navigate('/home');
    } catch (err) {
      setError('Phone sign-in failed');
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      {/* LEFT SIDE */}
      <div className="left-panel">
        <div className="logo-section">
          <h2>Connect, Learn & Grow</h2>
        </div>

        <div className="form-wrapper">
          <div className="form-content">
            <h2>Welcome Back</h2>
            <p className="subtitle">Please enter your details to sign in.</p>
            
            {/* Standard Login Form */}
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

            {/* DIVIDER */}
            <div className="divider">
              <span>OR CONTINUE WITH</span>
            </div>

            {/* NEW: Social Login Buttons with Icons */}
            <div className="social-login-buttons">
              <button className="social-btn google-btn" onClick={handleGoogleLogin}>
                {/* Inline SVG for Google Logo */}
                <svg className="btn-icon" width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2c0-.637-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fillRule="evenodd" fillOpacity="1" fill="#4285F4" stroke="none"></path>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.715H.957v2.332A8.997 8.997 0 0 0 9 18z" fillRule="evenodd" fillOpacity="1" fill="#34A853" stroke="none"></path>
                  <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fillRule="evenodd" fillOpacity="1" fill="#FBBC05" stroke="none"></path>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fillRule="evenodd" fillOpacity="1" fill="#EA4335" stroke="none"></path>
                </svg>
                Google
              </button>

              <button className="social-btn phone-btn" onClick={handlePhoneLogin}>
                {/* Inline SVG for Phone Icon */}
                <svg className="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5.5C3 4.11929 4.11929 3 5.5 3H18.5C19.8807 3 21 4.11929 21 5.5V18.5C21 19.8807 19.8807 21 18.5 21H5.5C4.11929 21 3 19.8807 3 18.5V5.5Z" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 18H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Phone Number
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT SIDE (Unchanged) */}
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
