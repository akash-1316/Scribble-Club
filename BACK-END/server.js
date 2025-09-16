import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ⚠️ LOAD ENV VARIABLES FIRST!
dotenv.config();

// DEBUG: Check if Stripe key is loaded
console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY ? "✅ Loaded" : "❌ Missing");
console.log("Mongo URI:", process.env.MONGO_URI ? "✅ Loaded" : "❌ Missing");

// Now import other modules that depend on environment variables
import productRoutes from "./routes/productsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import auth from "./middlewares/authMiddleware.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminOrderRoutes from "./routes/adminRoute.js";
import supportRoutes from "./routes/supportRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Error:", err));

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/support", supportRoutes);
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.get("/api/protected", auth, (req, res) => {
  res.json({ message: "You are authorized!", user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));