// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import ArtGallery from './components/ArtGallery';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ArtGallery" element={<ArtGallery />} />
      </Routes>
    </Router>
  );
};

export default App;