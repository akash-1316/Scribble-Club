import Order from "../models/Order.js";
import Razorpay from "razorpay";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id; // From auth middleware
    const { items, amount, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Create new order
    const newOrder = new Order({
      user: userId,
      items,
      amount,
      address,
      paymentMethod,
      status: paymentMethod === "COD" ? "Pending" : "Payment Initiated",
    });

    await newOrder.save();

    // If COD, return success immediately
    if (paymentMethod === "COD") {
      return res.json({ success: true, message: "Order placed successfully", order: newOrder });
    }

    // If Razorpay, create Razorpay order
    if (paymentMethod === "Razorpay") {
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: amount * 100, // Amount in paise
        currency: "INR",
        receipt: newOrder._id.toString(),
      };

      const razorpayOrder = await instance.orders.create(options);

      return res.json({
        success: true,
        message: "Razorpay order created",
        orderId: newOrder._id,
        razorpayOrder, // Pass this to frontend for Razorpay checkout
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
