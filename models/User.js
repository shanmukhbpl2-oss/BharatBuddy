import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    whatsappNumber: { type: String, unique: true, sparse: true }, // WhatsApp phone number
    name: String,
    language: { type: String, default: "hi" }, // Hindi or English preference
    isWhatsappUser: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    lastInteraction: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
