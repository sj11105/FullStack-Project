import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MyArtPiece from './MyArtPiece';
import { useLocation } from 'react-router-dom';
import './MyArtGallery.css';

const MyArtGallery = () => {
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

      // Fetch the art pieces from an API
      axios.get(`http://localhost:8000/api/artist_artworks/?user_id=${userIdFromQuery}`)
        .then(response => {
          setArtPieces(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the art pieces!", error);
        });
    }
  }, [query]);

  return (
    <div className="art-gallery">
      {artPieces.map((art, index) => (
        <MyArtPiece key={index} art={art} />
      ))}
    </div>
  );
};

export default MyArtGallery;
