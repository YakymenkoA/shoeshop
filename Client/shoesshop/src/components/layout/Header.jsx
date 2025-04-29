import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { isAuthenticated } from "../../services/isAuthenticated";
import { signOut } from "../../services/signOut";
import { UserService } from "../../services/userService";
import { CartItemService } from "../../services/cartService";

export default function Header() {
  const authenticated = isAuthenticated()
  const [flag, setFlag] = useState(false)
  const [count, setCount] = useState(0)

  const check = async () => {
    try {
      const response = await UserService.isAdmin()
      if(response.data) {
        setFlag(true)
      } else {
        setFlag(false)
      }
    } catch(error) {
      setFlag(false)
    }
  }

  useEffect(() => {
    check()
  })

  const getCartItemCount = async () => {
    try {
      const response = await CartItemService.getCartItemCount()
      setCount(response.data)
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    if(flag) {
      getCartItemCount()
    }
  }, [flag])

  return (
    <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">
              MyShop
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/home">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/catalog">
                  Catalog
                </Nav.Link>
                <Nav.Link as={Link} to="/about">
                  About
                </Nav.Link>
                <Nav.Link as={Link} to="/contacts">
                  Contacts
                </Nav.Link>
                {flag && (
                  <Nav.Link as={Link} to="/admin">
                    Admin
                  </Nav.Link>
                )}         
              </Nav>
              <Nav className="ms-auto">
                <Nav.Link as={Link}  to={authenticated ? "/cart" : "/signin"} style={{marginRight: '100px'}}>
                  <i className="bi bi-cart-plus"></i>
                  Cart (<span id="cart-items-count">{count}</span>)
                </Nav.Link>
              {authenticated ? (
                  <>
                    <Nav.Link as={Link} to="/profile">
                      Profile
                    </Nav.Link>
                    <Nav.Link as="button" onClick={signOut} style={{ cursor: 'pointer' }}>
                      Sign Out
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/signin">
                      Sign In
                    </Nav.Link>
                    <Nav.Link as={Link} to="/signup">
                      Sign Up
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    </header>
  );
}
