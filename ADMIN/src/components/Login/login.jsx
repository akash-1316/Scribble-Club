import React, { useState, useContext } from "react";
import axios from "axios"; // Add this import
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const { login, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${url}/api/users/login`, data);
      
      if (response.data.success) {
        const { accessToken, user } = response.data;
        
        // Login with the received token and user data
        login(accessToken, user);
        
        toast.success("Login successful!");
        
        // Redirect based on role
        if (user.role === "admin") {
          navigate("/");
        } else {
          navigate("/");
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">
      <form className="login-popup-inputs" onSubmit={onSubmitHandler}>
        <h2 className=".login-popup-title">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={data.email}
          onChange={onChangeHandler}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={onChangeHandler}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
    </div>
  );
};

export default Login;