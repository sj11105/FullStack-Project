import React from 'react';
import { Carousel } from 'react-bootstrap';


const ArtCarousel = () => {
  const artworks = [
    { id: 1, title:' ', imageUrl: 'https://m.media-amazon.com/images/I/71PMTDwZKML._AC_UF1000,1000_QL80_.jpg' },
    { id: 2, title: '', imageUrl: 'https://www.intellect-worldwide.com/wp-content/uploads/sites/123/2021/12/untitled1-1.jpg' },
    { id: 3, title: '', imageUrl: 'https://cdn.shopify.com/s/files/1/0036/8757/9760/files/82.jpg?v=1604230225' },
  ];

  return (
    <div className='caraousel'>
     
    <Carousel>
      {artworks.map((art) => (
        <Carousel.Item key={art.id}>
          <img
            className="d-block w-100"
            src={art.imageUrl}
            alt={art.title}
          />
          <Carousel.Caption>
            <h3>{art.title}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
    </div>
  );
};

export default ArtCarousel;
