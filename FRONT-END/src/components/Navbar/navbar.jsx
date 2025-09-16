import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import {
  FiMenu,
  FiX,
  FiSearch,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";
import "./navbar.css";
import assets from "../../assets/assets";

const Navbar = ({ setShowLogin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // ✅ dropdown state
  const { accessToken, setAccessToken, wishlist, user, url } =
    useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessToken("");
    toast.success("Logout Successfully");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Menu icon (mobile toggle) */}
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </div>

        {/* Logo */}
        <div className="logo">
          <img src={assets.logo} className="main" alt="logo" />
          <div className="line"></div>
          <Link to="/">Scribble Club</Link>
        </div>

        {/* Desktop icons */}
        <div className="nav-icons">
          <Link to="/search">
            <FiSearch size={30} className="icon" />
          </Link>
          <Link to="/fav">
            <FiHeart size={30} className="icon" />
            {wishlist.length > 0 && (
              <span className="count">{wishlist.length}</span>
            )}
          </Link>
          <Link to="/cart">
            <FiShoppingBag size={30} className="icon" />
          </Link>

          {!accessToken ? (
            <button onClick={() => setShowLogin(true)}>Sign In</button>
          ) : (
            <div className="navbar-profile">
              <img
                src={
                  user?.profilePic
                    ? `${url}${user.profilePic}`
                    : assets.profile_icon
                }
                alt="profile"
                className="nav-profile"
                onClick={() => setDropdownOpen(!dropdownOpen)} // ✅ toggle
              />
              {dropdownOpen && (
                <ul className="nav-profile-dropdown">
                  <li onClick={() => {navigate("/profile"); setDropdownOpen(false);}}>
                    <img src={assets.bag_icon} alt="" />
                    <p>Profile</p>
                  </li>
                  <li onClick={() => {navigate("/myorders"); setDropdownOpen(false);}}>
                    <img src={assets.bag_icon} alt="" />
                    <p>Orders</p>
                  </li>
                  <li onClick={() => {logout(); setDropdownOpen(false);}}>
                    <img src={assets.logout_icon} alt="logout" />
                    <p>Logout</p>
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${isOpen ? "active" : ""}`}>
        {!accessToken ? (
          <div className="account-section">
            <div className="zok">
              <h4>My Account</h4>
              <img
                className="bluelock"
                src={assets.cross_icon}
                alt="close"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <button className="login-btn" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button className="register-btn" onClick={() => setShowLogin(true)}>
              Register
            </button>
          </div>
        ) : (
          <div className="account-section">
            <div className="zok">
              <h4>My Account</h4>
              <img
                className="bluelock"
                src={assets.cross_icon}
                alt="close"
                onClick={() => setIsOpen(false)}
              />
            </div>
            <button onClick={() => navigate("/myorders")}>My Orders</button>
            <button onClick={() => navigate("/fav")}>Wishlist</button>
            <button onClick={() => navigate("/profile")}>Profile</button>
            <button onClick={logout}>Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
