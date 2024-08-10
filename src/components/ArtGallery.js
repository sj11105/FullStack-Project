import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArtPiece from './ArtPiece';
import NavigationBar from './Navbar';
import Caraousel from './Caraousel';
import { useLocation } from 'react-router-dom';
import './ArtGallery.css';

const ArtGallery = () => {
  const [artPieces, setArtPieces] = useState([]);
  const [userId, setUserId] = useState('');

  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();

  useEffect(() => {
    const userIdFromQuery = query.get('userId');
    if (userIdFromQuery) {
      setUserId(userIdFromQuery);
    }

  
    axios.get('http://localhost:8000/api/artworks/') 
      .then(response => {
        setArtPieces(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the art pieces!", error);
      });
  }, [query]);

  return (
    <div>
    <NavigationBar />
    <Caraousel />
    <div className="art-gallery">
      {artPieces.map((art, index) => (
        <ArtPiece key={index} art={art} />
      ))}
    </div>
  </div>
  );
}

export default ArtGallery;
