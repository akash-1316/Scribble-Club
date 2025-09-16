import React, { useContext } from "react"; 
import './navbar.css';
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const { token,  setToken } = useContext(StoreContext);

 const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("admin");
  setToken("");
  toast.success("Logout Successfully");
  navigate("/");
};

  return (
    <div>
      <div className="navbar">
        <div className="logo">
          <img src={assets.logo} className="main" alt="logo" />
          <div className="line"></div>
          <Link to="/">🎨 ArtWeb</Link>
        </div>

        {token ? (
          <p className="login-conditon" onClick={logout}>Logout</p>
        ) : (
          <p className="login-conditon" onClick={() => navigate("/")}>Login</p>
        )}

        <img className="profile" src={assets.profile_image} alt="profile" />
      </div>
    </div>
  );
};

export default Navbar;
