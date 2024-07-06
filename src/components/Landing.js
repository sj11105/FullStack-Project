import React from 'react'
import Navbar from './Navbar'
import ArtCarousel from './Caraousel'
import FeaturedWorks from './FeaturedWork'

export default function Landing() {
  return (
    <div>
   <Navbar />
   <div className='gifs'>
   
   <div className='gif'><img src="https://i.pinimg.com/originals/77/b1/21/77b121d158668bf5dc527047589f3d48.gif" alt="" /></div>
  <div className='gif2'>Welcome to our Virtual Art Gallery, where creativity knows no bounds. Explore a curated collection of contemporary and classic artworks from the comfort of your home. Our interactive platform offers an immersive experience, allowing you to appreciate the intricate details and rich stories behind each piece. Whether you're an art enthusiast or a casual visitor, you'll find inspiration and beauty in every corner. Discover, enjoy, and let the art speak to you in ways you've never imagined.</div> 
   </div>
   <ArtCarousel />
   
   <FeaturedWorks />
      
    </div>
  )
}
