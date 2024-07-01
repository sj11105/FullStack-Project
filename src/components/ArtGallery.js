import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArtPiece from './ArtPiece';

const ArtGallery = () => {
  const [artPieces, setArtPieces] = useState([]);

  useEffect(() => {
    // Fetch the art pieces from an API or a local JSON file
    axios.get('/artdata.json')
      .then(response => {
        setArtPieces(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the art pieces!", error);
      });
  }, []);

  return (
    <div className="art-gallery">
      {artPieces.map((art, index) => (
        <ArtPiece key={index} art={art} />
      ))}
    </div>
  );
}

export default ArtGallery;