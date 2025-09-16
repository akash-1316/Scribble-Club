import express from "express";
import { getAllOrders, updateOrderStatus } from "../controllers/orderController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// 🔐 Admin-only route: Get all orders
router.get("/", auth, async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
}, getAllOrders);

// 🔐 Admin-only route: Update order status
router.put("/:id", auth, async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  next();
}, updateOrderStatus);

export default router;
