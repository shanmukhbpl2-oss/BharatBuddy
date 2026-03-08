import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // WhatsApp number or user ID
    amount: { type: Number, required: true },
    category: {
      type: String,
      enum: ["Food", "Transport", "Medical", "Entertainment", "Shopping", "Bills", "Other"],
      default: "Other",
    },
    description: String,
    date: { type: Date, default: Date.now },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Card", "Other"], default: "Cash" },
    tags: [String], // e.g., ["grocery", "daily"]
  },
  { timestamps: true }
);

export const Expense = mongoose.model("Expense", expenseSchema);
