import React from 'react';
import { Link } from 'react-router-dom';
import './Navbox.css';

const NavigationBox = () => {
  return (
    <div className="navBoxContainer">
      <div className="titleContainer">
        <div className="navBoxTitle">Art Realm</div>
        <div className="navBoxSubtitle">Virtual Showcase and E-Auction</div>
      </div>
      <div className="navBoxButtons">
        <Link to="/register">
          <button className="button ">Sign Up</button>
        </Link>
        <Link to="/login">
          <button className="button">Sign In</button>
        </Link>
      </div>
    </div>
  );
};

export default NavigationBox;
