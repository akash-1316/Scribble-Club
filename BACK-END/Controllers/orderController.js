import Order from "../models/Order.js";
import stripe from "../config/stripe.js"

export const placeOrder = async (req, res) => {
  try {
    console.log("🔵 Place order request received");
    console.log("Request body:", req.body);
    console.log("User:", req.user);

    const userId = req.user.id;
    const { items, amount, address, paymentMethod, status } = req.body;

    if (!items || items.length === 0) {
      console.log("❌ Cart is empty");
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!paymentMethod) {
      console.log("❌ Payment method missing");
      return res.status(400).json({ success: false, message: "Payment method is required" });
    }

    console.log("📦 Creating order in database...");

    // Save order in DB
    const newOrder = new Order({
      user: userId,
      items,
      amount,
      address,
      paymentMethod,
      status: status || "Pending",
    });
    
    await newOrder.save();
    console.log("✅ Order saved:", newOrder._id);

    // Create Stripe checkout session only for card payments
    if (paymentMethod === "card") {
      try {
        console.log("💳 Processing card payment with Stripe...");
        
        const line_items = items.map((item) => ({
          price_data: {
            currency: "inr",
            product_data: { 
              name: item.name,
              images: item.image ? [item.image] : []
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        }));

        // Add delivery fee
        line_items.push({
          price_data: {
            currency: "inr",
            product_data: { name: "Delivery Fee" },
            unit_amount: 50 * 100,
          },
          quantity: 1,
        });

        const frontend_url = process.env.FRONTEND_URL || "http://localhost:5173";
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items,
  mode: "payment",
  success_url: `${frontend_url}/order-success?success=true&orderId=${newOrder._id}`,
  cancel_url: `${frontend_url}/order-failed?success=false&orderId=${newOrder._id}`,
  metadata: {
    orderId: newOrder._id.toString(),
    userId: userId.toString(),
  },
});

        console.log("✅ Stripe session created:", session.id);

        return res.json({
          success: true,
          message: "Order created successfully",
          order: newOrder,
          session_url: session.url,
          session_id: session.id,
        });
      } catch (stripeError) {
        console.error("❌ Stripe error:", stripeError);
        return res.status(500).json({
          success: false,
          message: "Payment processing error",
          error: stripeError.message
        });
      }
    }

    // For cash on delivery
    console.log("💰 COD order placed successfully");
    res.json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });

  } catch (err) {
    console.error("❌ Order placement error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message,
      error: err // Send full error for debugging
    });
  }
};

// ... rest of your functions (getUserOrders, getAllOrders, etc.)
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admin only" });
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price images")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admin only" });
    }

    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status || order.status;
    await order.save();

    res.json({ success: true, message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Verify Stripe payment
// ✅ Verify Stripe payment
export const verifyStripePayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log("🔵 Verifying payment for order:", orderId);

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // If order is already paid, just return success
    if (order.status === "Paid" || order.paymentStatus === "completed") {
      return res.json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    // For Stripe, we need to check the session status
    if (order.stripeSessionId) {
      const session = await stripe.checkout.sessions.retrieve(order.stripeSessionId);
      
      if (session.payment_status === 'paid') {
        order.status = "Paid";
        order.paymentStatus = "completed";
        await order.save();

        return res.json({
          success: true,
          message: "Payment verified successfully",
          order,
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          message: "Payment not completed",
          payment_status: session.payment_status
        });
      }
    }

    // If no payment method found
    return res.status(400).json({ 
      success: false, 
      message: "No payment information found for this order" 
    });

  } catch (err) {
    console.error("❌ Payment verification error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message,
      error: "Payment verification failed" 
    });
  }
};

// ✅ Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price images");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Check if user owns the order or is admin
    if (req.user.role !== "admin" && order.user._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};