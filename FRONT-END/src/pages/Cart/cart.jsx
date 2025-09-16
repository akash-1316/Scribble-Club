import React, { useContext, useEffect } from "react";
import "./cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, fetchCart, removeFromCart, updateCartQuantity,getTotalCartAmount,url } =
    useContext(StoreContext);

  const navigate = useNavigate();
   useEffect(() => {
    fetchCart();
  }, []);

  if (cart.length === 0) {
    return <h2>Your cart is empty 🛒</h2>;
  }

  const getTotal = () =>
    cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
   <>
   <div className="cart-head">
    <h1>Cart</h1>
   </div>
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
         {cart.map((item) => {
          if (item.quantity > 0)
          {
            return (
          <div key={item.product._id}>
          <div className="cart-items-title cart-items-item">
            <img className="item-image" src={`${url}/${item.product.image}`} alt={item.product.name} />
            <p>{item.product.name}</p>
            <p>₹{item.product.price}</p>
            <span>{item.quantity}</span>
            <p>₹{item.product.price * item.quantity}</p>
            <p onClick={() => removeFromCart(item.product._id)} className="cursor delete-btn">X</p>
          </div>
          <hr />
          </div>
        )
          }
         }
        )}
       </div>


      {/* Cart Bottom Section */}
      <div className="cart-bottom">
        {/* Cart Total */}
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotals</p>
              <p>₹{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{getTotalCartAmount() === 0 ? 0 : 50}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ₹
                {getTotalCartAmount() === 0
                  ? 0
                  : getTotalCartAmount() + 50}
              </b>
            </div>
          </div>
          <button onClick={() => navigate("/checkout")}>
            PROCEED TO CHECKOUT
          </button>
        </div>

        {/* Promo Code */}
        <div className="cart-promocode">
          <p>If you have a promocode, enter it here</p>
          <div className="cart-promocode-input">
            <input type="text" placeholder="Promo code" />
            <button>Submit</button>
          </div>
        </div>
      </div>
    </div>
   </>
  );
};

export default Cart;
