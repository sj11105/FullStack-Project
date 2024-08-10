import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import Navbox from './Navbox';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/login/', { username, password })
      .then(response => {
        console.log('Login successful:', response.data);
        setErrorMessage('');
        // Redirect to Gallery page with user_id as query parameter
        window.location.href = `/gallery?userId=${response.data.user_id}`;
      })
      .catch(error => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage('An error occurred. Please try again.');
        }
      });
  };

  return (
    <>
      <Navbox />
      <div className="container">
        <div className="background">
          <img src="https://res.cloudinary.com/jerrick/image/upload/v1682412853/6447953565c86d001de9aa14.jpg" alt="background" className="image" />
          <img src="https://rukminim2.flixcart.com/image/850/1000/jsdj8nk0/painting/3/y/x/npnt-can-093-perfect-original-imafdyxgkzzydpj9.jpeg?q=90&crop=false" alt="background" className="image" />
        </div>
        <div className='lcont'>
          <div className="login-container">
            <h2>Welcome Back!</h2>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <br /><br />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <br /><br />
              <button type="submit" className='Loginbtn'>Login</button>
              <br />
            </form>
            <br />
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
