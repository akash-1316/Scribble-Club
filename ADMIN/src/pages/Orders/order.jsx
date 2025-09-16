import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./orders.css";

const Orders = () => {
  const navigate = useNavigate();
  const { token, isAdmin, url, authRequest } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const response = await authRequest.get("/api/admin/orders");
      
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        toast.error("Please login again");
        navigate("/login");
      } else {
        toast.error("Error fetching orders");
      }
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await authRequest.put(`/api/admin/orders/${orderId}`, {
        status: event.target.value,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchAllOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating order status");
    }
  };
    const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "card":
        return assets.credit_card_icon;
      case "paypal":
        return assets.paypal_icon;
      case "cash":
        return assets.cash_icon;
      default:
        return assets.payment_icon;
    }
  };

  // Function to format payment method text
  const formatPaymentMethod = (method) => {
    switch (method) {
      case "card":
        return "Credit Card";
      case "paypal":
        return "PayPal";
      case "cash":
        return "Cash on Delivery";
      default:
        return method;
    }
  };

  useEffect(() => {
    if (!token || !isAdmin) {
      toast.error("Please login as admin");
      navigate("/");
      return;
    }
    fetchAllOrders();
  }, [token, isAdmin, navigate]);

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="order-item">
             <img src={assets.parcel_icon} alt="parcel" />
              <div>
                <p className="order-item-food">
                  {order.items
                    .map((item) => `${item.name} x ${item.quantity}`)
                    .join(", ")}
                </p>
                <p className="order-item-name">
                  {order.address.firstName} {order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street},</p>
                  <p>
                    {order.address.city}, {order.address.state},{" "}
                    {order.address.country}, {order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
              <p>₹{order.amount}</p>
              
              {/* Payment Method Display */}
              <div className="payment-method">
                <img 
                  src={getPaymentMethodIcon(order.paymentMethod)} 
                  alt={order.paymentMethod} 
                  className="payment-icon"
                />
                <span>{formatPaymentMethod(order.paymentMethod)}</span>
              </div>
              
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;