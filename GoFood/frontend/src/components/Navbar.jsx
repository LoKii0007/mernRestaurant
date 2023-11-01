import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Badge from "react-bootstrap/Badge";
import "./navbar.css";

function Navbar(props) {
  const navigate = useNavigate();

  const userProfile = {
    name: "John Doe",
    avatar:
      "https://www.testhouse.net/wp-content/uploads/2021/11/default-avatar.jpg",
  };

  function handleLogout(event) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("OTP");
    localStorage.removeItem("Admin");
    localStorage.removeItem("CartItems");
    localStorage.removeItem("currentUser");
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container-fluid ">
        <Link className="navbar-brand fs-1 fst-italic" to="/">
          GoFood
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2">
            <li className="nav-item">
              <Link className="nav-link active fs-5" aria-current="page" to="/">
                Home
              </Link>
            </li>
          </ul>
          {!localStorage.getItem("authToken") ? (
            <div className="d-flex">
              <ul>
                <Link className="btn bg-white text-success mx-1" to="/login">
                  Login
                </Link>
                <Link
                  className="btn bg-white text-success mx-1"
                  to="/createuser"
                >
                  SignUp
                </Link>
              </ul>
            </div>
          ) : (
            <div className="d-flex">
              <div className="profile-section">
                <Link className="btn bg-white text-danger mx-2" to="/cart">
                  Cart{" "}
                  <Badge pill bg="danger">
                    {props.length}
                  </Badge>
                </Link>

                <div className="nav-link">
                  <div className="profile-info">
                    <img src={userProfile.avatar} alt={userProfile.name} />
                    <span>{userProfile.name}</span>
                    <div>
                      <ul className="profile-dropdown">
                        <li>
                          <Link to="/profile" className="text-white">
                            Profile
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="text-white"
                            aria-current="page"
                            to="/myorder"
                          >
                            My Orders
                          </Link>
                        </li>
                        <li>
                          <Link
                            className="text-white"
                            onClick={handleLogout}
                            to="/login"
                          >
                            Logout
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
