import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ArtPiece from './ArtPiece';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";


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
    <>
    <ul><li className='nav'><Link to="/Profile"><CgProfile className='profile' /></Link></li></ul>
   <div className="art-gallery">
      {artPieces.map((art, index) => (
        <ArtPiece key={index} art={art} />
      ))}
    </div>
    </>
  );
}

export default ArtGallery;