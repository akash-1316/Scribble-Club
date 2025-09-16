import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const url = "https://scribble-club-backend.onrender.com";
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();
    } catch (e) {
      return true;
    }
  };

  // Check if user is admin when token changes
  useEffect(() => {
    if (token && !isTokenExpired(token)) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setIsAdmin(decodedToken?.role === "admin");
      
      if (decodedToken && !user) {
        const userData = {
          id: decodedToken.id,
          name: decodedToken.name,
          email: decodedToken.email,
          role: decodedToken.role
        };
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } else {
      // Token is expired or invalid
      logout();
    }
  }, [token]);

  // Login function
  const login = (accessToken, userData) => {
    setToken(accessToken);
    setUser(userData);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setToken("");
    setUser(null);
    setIsAdmin(false);
    setCart([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.info("Logged out");
  };

  // Auth request interceptor
  const authRequest = axios.create({
    baseURL: url,
  });

  // Add token to requests
  authRequest.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Handle token expiration
  authRequest.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        toast.error("Session expired. Please login again.");
      }
      return Promise.reject(error);
    }
  );

  // ... rest of your functions (addToCart, removeFromCart, etc.)
    const addToCart = (item) => {
    setCart(prev => {
      const existingItem = prev.find(i => i.product._id === item.product._id);
      if (existingItem) {
        return prev.map(i =>
          i.product._id === item.product._id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Remove from cart function
  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product._id !== productId));
  };

  // Clear cart function
  const clearCart = () => {
    setCart([]);
  };

  // Get total cart amount
  const getTotalCartAmount = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };


  const contextValue = {
    url,
    token,
    user,
    isAdmin,
    cart,
    login,
    logout,
    authRequest, // Add this
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
