// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import ArtGallery from './components/ArtGallery';
import Profile from './components/Profile';
import Landing from './components/Landing';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path='/Login' element={<Login />}/>
        <Route path="/register" element={<Register />} />
        <Route path="/ArtGallery" element={<ArtGallery />} />
        <Route path="/Profile" element={<Profile />}/>
      </Routes>
    </Router>
  );
};

export default App;