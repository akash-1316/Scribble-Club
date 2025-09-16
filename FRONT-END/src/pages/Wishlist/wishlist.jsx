import "./wishlist.css";
import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";

const Wishlist = () => {
  const { wishlist, removeFromWishlist,url } = useContext(StoreContext);

  if (wishlist.length === 0) {
    return <h2>Your Wishlist is empty ❤️</h2>;
  }

  return (
    <div className="wishlist-page">
      <h2>My Wishlist</h2>
      {wishlist.map((item) => (
        <div key={item._id} className="wishlist-item">
          <img src={`${url}/${item.image}`} alt={item.name} />
          <div>
            <h4>{item.name}</h4>
            <p>₹{item.price}</p>
            <button onClick={() => removeFromWishlist(item._id)}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
