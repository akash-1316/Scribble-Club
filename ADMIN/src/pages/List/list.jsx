import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./list.css";

const List = () => {
  const navigate = useNavigate();
  const { url, token, isAdmin } = useContext(StoreContext);
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${url}/api/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch {
      toast.error("Failed to load products");
    }
  };

  const removeProduct = async (id) => {
    if (!token || !isAdmin) {
      toast.error("Unauthorized");
      return;
    }
    try {
      await axios.delete(`${url}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted");
      fetchProducts();
    } catch {
      toast.error("Error deleting product");
    }
  };

  useEffect(() => {
    if (!token || !isAdmin) {
      toast.error("Please login as admin");
      navigate("/");
      return;
    }
    fetchProducts();
  }, [token, isAdmin, navigate]);

  return (
    <div className="list add flex-col">
      <p>All Products</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Price</b>
          <b>Action</b>
        </div>

        {products.length === 0 && <p>No products found.</p>}

        {products.map((product) => (
          <div key={product._id} className="list-table-format">
            <img src={`${url}/${product.image}`} alt={product.name} />
            <p>{product.name}</p>
            <p>₹{product.price}</p>
            <p
              onClick={() => removeProduct(product._id)}
              className="cursor delete-btn"
              title="Delete product"
            >
              X
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
