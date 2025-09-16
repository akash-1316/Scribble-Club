import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";   // ✅ import navigate
import "./Loginpopup.css";
import assets from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";

const Loginpopup = ({ setShowLogin }) => {
  const { url, setAccessToken, setRefreshToken, setUser } = useContext(StoreContext);
  const navigate = useNavigate();   // ✅ init navigate

  const [currentState, setCurrentState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((data) => ({ ...data, [name]: value }));
  };

const onLogin = async (event) => {
  event.preventDefault();
  try {
    let newUrl = url;
    if (currentState === "Login") {
      newUrl += "/api/users/login";
    } else {
      newUrl += "/api/users/register";
    }

    const response = await axios.post(newUrl, data);
    console.log("Auth response:", response.data);

  if (response.data.accessToken && response.data.refreshToken) {
  setAccessToken(response.data.accessToken);
  setRefreshToken(response.data.refreshToken);
  setUser(response.data.user);

  localStorage.setItem("accessToken", response.data.accessToken);
  localStorage.setItem("refreshToken", response.data.refreshToken);
  localStorage.setItem("user", JSON.stringify(response.data.user));

  if (response.data.role) {
    localStorage.setItem("role", response.data.role);
  }

  toast.success(
    currentState === "Login"
      ? "Logged in successfully!"
      : "Account created successfully!"
  );

  setShowLogin(false);
  navigate("/");
} else {
  toast.error(response.data.message || "Authentication failed");
}
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      toast.error(error.response.data.message || "Request failed");
    } else {
      console.error("Auth Error:", error.message);
      toast.error("Network error. Please try again.");
    }
  }
};

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currentState !== "Login" && (
            <input
              name="name"
              type="text"
              onChange={onChangeHandler}
              value={data.name}
              placeholder="Your Name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Your password"
            required
          />
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Create Account" : "Login"}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>
            By continuing, I agree to the terms of use & privacy policy.
          </p>
        </div>
        {currentState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrentState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrentState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default Loginpopup;
