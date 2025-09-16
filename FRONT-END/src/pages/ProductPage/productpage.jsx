import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./productpage.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { url, wishlist, addToWishlist, removeFromWishlist,addToCart, cart } =
    useContext(StoreContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(null);
  const isInWishlist =
    product && wishlist.some((item) => item._id === product._id);
  const isInCart =
    product && cart.some((item) => item.product._id === product._id);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${url}/api/products/${id}`);
      const prod = {
        ...response.data,
        image: `${url}/${response.data.image.replace(/\\/g, "/")}`,
      };
      setProduct(prod);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching product:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found</div>;

  const tabs = [
    {
      id: "offers",
      label: "Offers",
      content: "Get 10% off with credit card offers!",
    },
    {
      id: "description",
      label: "Description",
      content: product.description || "No description available.",
    },
    {
      id: "shipping",
      label: "Shipping & Return Info",
      content: "Free shipping on orders above ₹999. Easy 7-day returns.",
    },
    {
      id: "additional",
      label: "Additional Info",
      content: "This product is handmade with premium materials.",
    },
  ];

  return (
    <div className="product-detail">
      <div className="product-images">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h2 className="product-title">{product.name}</h2>

        <div className="product-price">
          <span className="current-price">Price - ₹{product.price}</span>
        </div>
        <p className="stock">In stock</p>

        <div className="quantity">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

          {!isInCart ? (
          <button
            className="add-to-cart"
            onClick={() => addToCart(product._id, quantity)}
          >
            Add to cart
          </button>
        ) : (
          <button className="add-to-cart" disabled>
            Already in cart
          </button>
        )}
        <button
          className="wishlist"
          onClick={() =>
            isInWishlist
              ? removeFromWishlist(product._id)
              : addToWishlist(product._id) 
          }
        >
          {isInWishlist ? "♥ In Wishlist" : "♡ Wishlist"}
        </button>

        <div className="tabs">
          {tabs.map((tab) => (
            <div key={tab.id} className="tab-item">
              <div
                className="tab-header"
                onClick={() =>
                  setActiveTab(activeTab === tab.id ? null : tab.id)
                }
              >
                {tab.label}
                <span>{activeTab === tab.id ? "−" : "+"}</span>
              </div>
              {activeTab === tab.id && (
                <div className="tab-content">{tab.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
