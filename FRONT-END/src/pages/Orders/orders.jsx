import React, { useContext, useEffect, useState } from "react";
import "./orders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import assets from "../../assets/assets";
import { toast } from "react-toastify";

const MyOrders = () => {
  const { url, accessToken } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    if (!accessToken) return;
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
      toast.error("Something went wrong while fetching orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchOrders();
    }
  }, [accessToken]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {loading && <p>Loading orders...</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}
      <div className="container">
        {orders.map((order) => (
          <div key={order._id} className="my-orders-order">
            <img src={assets.parcel_icon} alt="parcel" />
            <p>
              {order.items
                .map((item) => `${item.name} X ${item.quantity}`)
                .join(", ")}
            </p>
            <p>₹{order.amount}</p>
            <p>Items: {order.items.length}</p>
            <p>
              <span>&#x25cf;</span>
              <b> {order.status}</b>
            </p>
            <button onClick={fetchOrders}>Refresh</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
