import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./products.css";
import { StoreContext } from "../../context/StoreContext";

const Products = () => {
  const { url } = useContext(StoreContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

 const fetchProducts = async () => {
  try {
    const response = await axios.get(`${url}/api/products`);
    const productsWithImages = response.data.map((prod) => ({
      ...prod,
      image: `${url}/${prod.image.replace(/\\/g, "/")}`,
    }));
    setProducts(productsWithImages);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching products:", err);
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="pro">
      <div className="pro-top">
        <div className="pro-head">Products Available on Store</div>
      </div>

      <div className="pro-bottom">
        <div className="boxes">
          {products.map((product) => (
            <div className="box" key={product._id}>
              <div className="box-top">
                <img className="pro-image" src={product.image} alt={product.name} />
              </div>
              <div className="box-bottom">
                <div className="pri">
                  <div className="pri-right">
                    <div className="pri-title">{product.name}</div>
                    <div className="pri-rate">Price ₹.{product.price}</div>
                    <div className="pri-desc">{product.description}</div>
                  </div>
                  <div className="pri-left">
                    <Link to={`/product/${product._id}`}>
                      <button className="custom-btn btn-3">
                        <span>Buy now</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {products.length === 0 && <p>No products found.</p>}
        </div>
      </div>
    </div>
  );
};

export default Products;
