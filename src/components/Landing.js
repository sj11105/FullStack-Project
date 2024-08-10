import React from 'react';
import NavigationBox from './Navbox';
import ArtCarousel from './Caraousel';
import './Landing.css'; // Import the new CSS file

export default function Landing() {
  return(
    <div>
      <NavigationBox />
      <div className = 'LandingBody'>
      <ArtCarousel />
      <div className='gifs'>
        <div className='gif'><img src="https://i.pinimg.com/originals/77/b1/21/77b121d158668bf5dc527047589f3d48.gif" alt="" /></div>
        <div className='gif2'>
          <h2 className='head text-bold text-xl'>About Us</h2>
          <p className='para'>Welcome to our Virtual Art Gallery, where creativity knows no bounds. Explore a curated collection of contemporary and classic artworks from the comfort of your home. Our interactive platform offers an immersive experience, allowing you to appreciate the intricate details and rich stories behind each piece. Whether you're an art enthusiast or a casual visitor, you'll find inspiration and beauty in every corner. Discover, enjoy, and let the art speak to you in ways you've never imagined.</p>
        </div>
      </div><div/>
      
     </div>
    </div>
  );
}
