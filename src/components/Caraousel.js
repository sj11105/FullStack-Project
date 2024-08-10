import React, { useState, useEffect } from 'react';
import './Caraousel.css'; // Assuming you have a separate CSS file

const ArtCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const artworks = [
    { id: 1, title: 'Artwork1', imageUrl: 'https://m.media-amazon.com/images/I/71PMTDwZKML._AC_UF1000,1000_QL80_.jpg' },
    { id: 2, title: 'Artwork 2', imageUrl: 'https://www.intellect-worldwide.com/wp-content/uploads/sites/123/2021/12/untitled1-1.jpg' },
    { id: 3, title: 'Artwork 3', imageUrl: 'https://cdn.shopify.com/s/files/1/0036/8757/9760/files/82.jpg?v=1604230225' },
    { id: 4, title: 'Artwork 4', imageUrl: 'https://t3.ftcdn.net/jpg/02/73/22/74/360_F_273227473_N0WRQuX3uZCJJxlHKYZF44uaJAkh2xLG.jpg' },
    // { id: 5, title: 'Artwork 5', imageUrl: 'https://www.artic.edu/iiif/2/4d00e6e7-dc95-6983-cb4a-18869bc16206/full/1000,/0/default.jpg' },
    // {id: 6, title: 'Artwork 6', imageUrl: 'https://www.nationalgallery.org.uk/media/19042/leonardo-arnolfini-portrait-tile-5-1440x1440.jpg' }
  ];

  useEffect(() => {
    // Set initial currentIndex to 0 to display the first image
    let initialIndex = 0;
    setCurrentIndex(initialIndex);

    // Automatically change slide every 3 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === artworks.length - 1 ? 0 : prevIndex + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [artworks.length]);

  return (
    <div className='carousel'>
      <div className='slide-container' style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {artworks.map((art) => (
          <div key={art.id} className='slide'>
            <img src={art.imageUrl} alt={art.title} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtCarousel;
