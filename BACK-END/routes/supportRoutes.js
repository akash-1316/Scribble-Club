import express from "express";
import SupportMessage from "../models/Support.js";
import auth from "../middlewares/authMiddleware.js";

const router = express.Router();

// 📌 User: send a message
router.post("/", auth, async (req, res) => {
  try {
    const { subject, message } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ success: false, message: "Subject and message are required" });
    }

    const newMsg = new SupportMessage({
      userId: req.user.id,
      name: req.user.name || "Anonymous",
      email: req.user.email || "N/A",
      subject,
      message,
    });

    await newMsg.save();
    res.status(201).json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
});

// 📌 Admin: view all messages
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// 📌 Admin: mark message as resolved
router.patch("/:id/resolve", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const msg = await SupportMessage.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, message: "Message marked as resolved", msg });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update message" });
  }
});

// 📌 Admin: delete message
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }

    const msg = await SupportMessage.findByIdAndDelete(req.params.id);
    if (!msg) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    res.json({ success: true, message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete message" });
  }
});

export default router;
