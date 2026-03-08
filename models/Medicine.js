import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // WhatsApp number or user ID
    medicineName: { type: String, required: true },
    dosage: String, // e.g., "2 tablets", "5ml"
    frequency: String, // e.g., "Twice daily", "Every 8 hours"
    reminderTime: [String], // e.g., ["08:00", "20:00"]
    startDate: Date,
    endDate: Date,
    notes: String,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Medicine = mongoose.model("Medicine", medicineSchema);
