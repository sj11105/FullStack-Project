// src/components/Login.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import necessary components from react-router-dom
import axios from 'axios';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/api/login/', { username, password })
      .then(response => {
        console.log('Login successful:', response.data);
        // Redirect to gallery or handle success as needed
      })
      .catch(error => {
        console.error('Login failed:', error);
        // Handle error (show message or redirect to register)
      });
  };

  return (
    <>
    <div className='imgdiv' >
      <img src="https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXJ0JTIwZ2FsbGVyeXxlbnwwfHwwfHx8MA%3D%3D" alt="" />
      </div>
      <h2 className='heading'>Travel the World Of Art With Us</h2>
    <div className='lcont'>
    
    <div className="login-container">
      
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required /><br></br><br></br>
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /><br></br><br></br>
        <button type="submit" className='Loginbtn'>Login</button><br></br>
      </form><br></br>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
    </div>
    </>
  );
};

export default Login;
