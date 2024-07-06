import React from 'react';


const FeaturedWorks = () => {
  const featuredWorks = [
    { id: 1, title: '#1', imageUrl: 'https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/2018/01/24115425/720.jpg?w=1200&h=628&fill=blur&fit=fill' },
    { id: 2, title: '#2', imageUrl: 'https://images.rawpixel.com/image_800/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcGQyNDQtcGRmYW1vdXNwYWludGluZ2V0YzA2ODAwMy0xLWltYWdlLWpvYjU4Mi0yLmpwZw.jpg' },
    { id: 3, title: '#3', imageUrl: 'https://www.artfactory.in/product_pictures/CP-M198.jpg' },
  ];

  return (
    <section id="featured" className="featured-works">
      <h2 className='work'>Featured Works</h2>
      <div className="work-grid">
        {featuredWorks.map((work) => (
          <div key={work.id} className="work-item">
            <img src={work.imageUrl} alt={work.title} />
            <h3>{work.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedWorks;
