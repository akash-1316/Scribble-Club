import express from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, verifyStripePayment } from "../Controllers/orderController.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/place", auth, placeOrder);
router.get("/myorders", auth, getUserOrders);
router.get("/", auth, getAllOrders); 
router.put("/:id", auth, updateOrderStatus);
router.post("/verify", auth, verifyStripePayment);

export default router;
