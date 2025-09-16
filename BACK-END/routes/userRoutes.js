import express from "express";
import {
  loginUser,
  registerUser,
  refreshToken,
} from "../controllers/userController.js";
import auth from "../middlewares/authMiddleware.js";
import User from "../models/User.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// 🔐 Auth Routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.post("/refresh", refreshToken); // 🔑 refresh route

// ✅ Wishlist Routes
router.post("/wishlist/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.wishlist.includes(req.params.productId)) {
      user.wishlist.push(req.params.productId);
      await user.save();
    }

    const updatedUser = await User.findById(req.user.id).populate("wishlist");

    res.json({ success: true, wishlist: updatedUser.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/wishlist/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user.id).populate("wishlist");

    res.json({ success: true, wishlist: updatedUser.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/wishlist", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");
    res.json({ success: true, wishlist: user.wishlist });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Cart Routes
router.post("/cart/:productId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === req.params.productId
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      user.cart.push({ product: req.params.productId, quantity: quantity || 1 });
    }

    await user.save();
    await user.populate("cart.product");

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/cart/:productId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await user.save();
    await user.populate("cart.product");

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✅ Clear entire cart
router.delete("/cart", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.cart = [];
    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/cart/:productId", auth, async (req, res) => {
  try {
    const { quantity } = req.body;
    const user = await User.findById(req.user.id);

    const item = user.cart.find(
      (i) => i.product.toString() === req.params.productId
    );

    if (item) {
      item.quantity = quantity;
    }

    await user.save();
    await user.populate("cart.product");

    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/cart", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product");
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// orderRoutes.js
router.post("/verify", auth, async (req, res) => {
    try {
        const { success, orderId } = req.body;

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        if (success === "true") {
            order.status = "Paid";
            await order.save();
            return res.json({ success: true, message: "Payment verified successfully" });
        } else {
            order.status = "Failed";
            await order.save();
            return res.json({ success: false, message: "Payment failed" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

router.put("/profile/picture", auth, upload.single("profilePic"), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Save file path in DB
    user.profilePic = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ success: true, message: "Profile picture updated", profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/profile", auth, async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();
    res.json({ success: true, message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
