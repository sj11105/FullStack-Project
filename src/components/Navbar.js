import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
  return (
    <Navbar bg="" variant="" expand="lg " className='navbar'>
      <Container>
        <Navbar.Brand href="#home">Virtual Art Gallery</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#featured">Featured</Nav.Link>
            <Nav.Link href="#contact">Contact</Nav.Link>
            
          </Nav>
        <Link to="/Login"><button className='signin'>SignIn</button></Link>  
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
