import mongoose from "mongoose";

const supportMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "resolved"], default: "pending" }
  },
  { timestamps: true }
);

const SupportMessage = mongoose.model("SupportMessage", supportMessageSchema);
export default SupportMessage;
