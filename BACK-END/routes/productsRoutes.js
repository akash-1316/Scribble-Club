import express from "express";
import Product from "../models/Product.js";
import auth from "../middlewares/authMiddleware.js";
import admin from "../middlewares/admin.js";
import upload from "../middlewares/uploadMiddleware.js"; // ✅ import multer setup
const router = express.Router();

// GET all products (Public)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// POST new product (Admin only)
router.post("/", auth, admin, upload.single("image"), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, "/") : null; // ✅ multer handles image

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const product = new Product({ name, price, description, image });
    await product.save();

    res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE product (Admin only)
router.delete("/:id", auth, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
