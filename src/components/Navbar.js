import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NavigationBar = () => {
  const query = new URLSearchParams(useLocation().search);
  const userId = query.get('userId');

  return (
    <Navbar expand="lg" className='navbar'>
      <Container>
      <div className="titleContainerNav">
        <div className="navBarTitle">Art Realm</div>
        <div className="navBarSubtitle">Virtual Showcase and E-Auction</div>
      </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link as={Link} to={`/gallery?userId=${userId}`}>Home</Nav.Link>
            <Nav.Link as={Link} to={`/profile?userId=${userId}`}>Profile</Nav.Link>
            <Nav.Link as={Link} to={`/auction?userId=${userId}`}>Auction</Nav.Link>
            <Nav.Link as={Link} to={`/transaction?userId=${userId}`}>MyTransactions</Nav.Link>
            <Nav.Link as={Link} to="/">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
