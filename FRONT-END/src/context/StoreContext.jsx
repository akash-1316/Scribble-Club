import axios from "axios";
import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const url = "http://localhost:5000";
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || "");
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || "");
  const [admin, setAdmin] = useState(localStorage.getItem("role") === "admin");
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("user")) || null
);

  // ✅ Axios instance with interceptor
  const api = axios.create({ baseURL: url });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry && refreshToken) {
        originalRequest._retry = true;

        try {
          const res = await axios.post(`${url}/api/users/refresh`, { refreshToken });
          if (res.data.success) {
            setAccessToken(res.data.accessToken);
            localStorage.setItem("accessToken", res.data.accessToken);

            originalRequest.headers["Authorization"] = `Bearer ${res.data.accessToken}`;
            return api(originalRequest); // retry with new token
          }
        } catch (err) {
          console.error("Refresh token failed:", err);
          logout();
        }
      }

      return Promise.reject(error);
    }
  );

  // ✅ Fetch wishlist
  const fetchWishlist = async () => {
    if (!accessToken) return;
    try {
      const res = await api.get(`/api/users/wishlist`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data.success) {
        setWishlist(res.data.wishlist);
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  // ✅ Login
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${url}/api/users/login`, { email, password });

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setUser(response.data.user);

        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast.success("Login successful");
        await fetchWishlist();
      } else {
        toast.error("Invalid credentials");
      }
    } catch (err) {
      toast.error("Login failed");
    }
  };

  // ✅ Register
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${url}/api/users/register`, { name, email, password });

      if (response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setUser(response.data.user);

        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        toast.success("Account created successfully");
        await fetchWishlist();
      } else {
        toast.error("Registration failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration error");
    }
  };

  // ✅ Logout
  const logout = () => {
    setAccessToken("");
    setRefreshToken("");
    setUser(null);
    setWishlist([]);
    setCart([]);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    toast.info("Logged out");
  };

  // ✅ Wishlist actions
  const addToWishlist = async (productId) => {
    try {
      const res = await api.post(
        `/api/users/wishlist/${productId}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      toast.error("Login to add to wishlist");
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await api.delete(`/api/users/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        toast.info("Removed from wishlist");
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove from wishlist");
    }
  };

  // ✅ Cart actions
  const fetchCart = async () => {
    if (!accessToken) return;
    try {
      const res = await api.get(`/api/users/cart`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data.success) setCart(res.data.cart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const res = await api.post(
        `/api/users/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) {
        setCart(res.data.cart);
        toast.success("Added to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Failed to add to cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete(`/api/users/cart/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data.success) setCart(res.data.cart);
    } catch (err) {
      console.error("Error removing from cart:", err);
    }
  };

  const updateCartQuantity = async (productId, quantity) => {
    try {
      const res = await api.put(
        `/api/users/cart/${productId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (res.data.success) setCart(res.data.cart);
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };
  // Inside StoreContextProvider (StoreContext.js)
const fetchProfile = async () => {
  if (!accessToken) return;
  try {
    const res = await api.get(`/api/users/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
  }
};

const updateProfile = async (updates) => {
  try {
    const res = await api.put(`/api/users/profile`, updates, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Profile updated");
    }
  } catch (err) {
    toast.error("Failed to update profile");
    console.error(err);
  }
};

const uploadProfilePicture = async (file) => {
  try {
    const formData = new FormData();
    formData.append("profilePic", file);

    const res = await api.put(`/api/users/profile/picture`, formData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      setUser((prev) => ({ ...prev, profilePic: res.data.profilePic }));
      localStorage.setItem(
        "user",
        JSON.stringify({ ...user, profilePic: res.data.profilePic })
      );
      toast.success("Profile picture updated");
    }
  } catch (err) {
    toast.error("Failed to upload profile picture");
    console.error(err);
  }
};


  const getTotalCartAmount = () =>
    cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

 const clearCart = async () => {
  if (!accessToken) {
    toast.error("Please login to clear cart");
    return;
  }

  try {
    await api.delete(`/api/users/cart`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    setCart([]);
    toast.info("Cart cleared");
  } catch (err) {
    console.error("Error clearing cart:", err);

    // If 401, try refreshing token
    if (err.response?.status === 401 && refreshToken) {
      try {
        const res = await axios.post(`${url}/api/users/refresh`, { refreshToken });
        if (res.data.success) {
          setAccessToken(res.data.accessToken);
          localStorage.setItem("accessToken", res.data.accessToken);

          // Retry clearing cart
          await api.delete(`/api/users/cart`, {
            headers: { Authorization: `Bearer ${res.data.accessToken}` },
          });
          setCart([]);
          toast.info("Cart cleared");
          return;
        }
      } catch (refreshErr) {
        console.error("Refresh token failed:", refreshErr);
        logout();
        toast.error("Session expired. Please login again");
        return;
      }
    }

    toast.error("Failed to clear cart");
  }
};

  // ✅ Restore user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && accessToken) {
      setUser(JSON.parse(savedUser));
      fetchWishlist();
      fetchCart();
    }
  }, [accessToken]);

  return (
    <StoreContext.Provider
      value={{
        url,
        login,
        logout,
        register,
        wishlist,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
        accessToken,
        admin,
        setAdmin,
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        getTotalCartAmount,
        clearCart,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        user,
        setUser,
        fetchProfile,
        updateProfile,
        uploadProfilePicture
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
