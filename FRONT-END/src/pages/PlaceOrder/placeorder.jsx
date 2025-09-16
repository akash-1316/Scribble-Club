import React, { useContext, useEffect, useState } from "react";
import "./placeorder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const navigate = useNavigate();
  const { cart, getTotalCartAmount, accessToken, url, clearCart } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    setIsProcessing(true);

    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty!");
      setIsProcessing(false);
      return;
    }

    try {
      const orderData = {
        address: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          street: data.street,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          country: data.country,
          phone: data.phone,
        },
        items: cart.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.image || "",
        })),
        amount: getTotalCartAmount() + 50,
        paymentMethod,
      };

      const token = accessToken || localStorage.getItem("accessToken");

      // Create order in DB and get Stripe session
      const res = await axios.post(`${url}/api/orders/place`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.data.success) {
        toast.error(res.data.message || "Error placing order");
        setIsProcessing(false);
        return;
      }

      // Stripe flow for card payments
      if (paymentMethod === "card" && res.data.session_url) {
        // Redirect to Stripe Checkout
        window.location.href = res.data.session_url;
      } else if (paymentMethod === "cod") {
        // COD: no online payment
        toast.success("Order placed successfully (COD)");
        clearCart();
        navigate("/myorders");
      } else {
        toast.error("Payment method not supported");
      }

    } catch (err) {
      console.error("Order error:", err);
      toast.error(err.response?.data?.message || "Something went wrong while placing the order");
      setIsProcessing(false);
    }
  };

  // Check for successful Stripe return from redirect
  useEffect(() => {
    const checkPaymentStatus = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const success = urlParams.get('success');
      const orderId = urlParams.get('orderId');

      if (success === 'true' && orderId) {
        try {
          const token = accessToken || localStorage.getItem("accessToken");
          
          // Verify payment with backend
          const verifyRes = await axios.post(
            `${url}/api/orders/verify-payment`,
            { orderId },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verifyRes.data.success) {
            toast.success("Payment successful! Order confirmed.");
            clearCart();
            navigate("/myorders", { replace: true });
          } else {
            toast.error("Payment verification failed");
            navigate("/cart");
          }
        } catch (error) {
          console.error("Payment verification error:", error);
          toast.error("Error verifying payment");
          navigate("/cart");
        }
      }
    };

    checkPaymentStatus();
  }, [accessToken, url, clearCart, navigate]);

  // Also check on component mount if we're returning from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const orderId = urlParams.get('orderId');

    if (success === 'false' && orderId) {
      toast.error("Payment was cancelled");
      navigate("/cart");
    }
  }, [navigate]);

  useEffect(() => {
    if (!accessToken) {
      toast.error("Please login first!");
      navigate("/");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [accessToken, getTotalCartAmount, navigate]);

  return (
    <form className="place-order" onSubmit={placeOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input className="mark" required name="firstName" value={data.firstName} onChange={onChangeHandler} type="text" placeholder="First name" />
          <input className="mark" required name="lastName" value={data.lastName} onChange={onChangeHandler} type="text" placeholder="Last name" />
        </div>
        <input className="mark" required name="email" value={data.email} onChange={onChangeHandler} type="email" placeholder="Email Address" />
        <input className="mark" required name="street" value={data.street} onChange={onChangeHandler} type="text" placeholder="Street" />
        <div className="multi-fields">
          <input className="mark" required name="city" value={data.city} onChange={onChangeHandler} type="text" placeholder="City" />
          <input className="mark" required name="state" value={data.state} onChange={onChangeHandler} type="text" placeholder="State" />
        </div>
        <div className="multi-fields">
          <input className="mark" required name="zipcode" value={data.zipcode} onChange={onChangeHandler} type="text" placeholder="Zip Code" />
          <input className="mark" required name="country" value={data.country} onChange={onChangeHandler} type="text" placeholder="Country" />
        </div>
        <input className="mark" required name="phone" value={data.phone} onChange={onChangeHandler} type="text" placeholder="Phone" />

        <div className="payment-method">
          <label>
            <input 
              type="radio" 
              name="paymentMethod" 
              value="card" 
              checked={paymentMethod === "card"} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
            />
            Credit/Debit Card (Stripe)
          </label>
          <label>
            <input 
              type="radio" 
              name="paymentMethod" 
              value="cod" 
              checked={paymentMethod === "cod"} 
              onChange={(e) => setPaymentMethod(e.target.value)} 
            />
            Cash on Delivery
          </label>
        </div>
      </div>

      <div className="place-order-right">
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
              <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 50}</b>
            </div>
          </div>
          <button type="submit" disabled={isProcessing}>
            {isProcessing ? "PROCESSING..." : paymentMethod === "card" ? "PROCEED TO PAYMENT" : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
