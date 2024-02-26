import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('https://localhost:44331/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (response.ok) {
          console.log('Login successful');

          const data = await response.json();
          const token = data.token;
          localStorage.setItem("token", token);
          navigate('/home')
    
        } else {
          // Handle login error
          console.error('Login failed');
          setError('Invalid email or password');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error-message">{error}</p>}
            </div>
            <button type="submit" className="btn-signin">Sign In</button>
          </form>
        </div>
      </div>
    );
  }
  
  export default Login;