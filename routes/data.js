import express from "express";
import { Medicine } from "../models/Medicine.js";
import { Expense } from "../models/Expense.js";
import { User } from "../models/User.js";

const router = express.Router();

// ==================== MEDICINE ROUTES ====================

// Add medicine
router.post("/medicines/add", async (req, res) => {
  try {
    const { userId, medicineName, dosage, frequency, reminderTime, startDate, endDate, notes } = req.body;

    if (!userId || !medicineName) {
      return res.status(400).json({ error: "userId and medicineName are required" });
    }

    const medicine = new Medicine({
      userId,
      medicineName,
      dosage,
      frequency,
      reminderTime,
      startDate,
      endDate,
      notes,
    });

    await medicine.save();
    res.json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's medicines
router.get("/medicines/:userId", async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.params.userId, isActive: true });
    res.json({ success: true, medicines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update medicine
router.put("/medicines/:id", async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, medicine });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete medicine
router.delete("/medicines/:id", async (req, res) => {
  try {
    await Medicine.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: "Medicine removed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== EXPENSE ROUTES ====================

// Add expense
router.post("/expenses/add", async (req, res) => {
  try {
    const { userId, amount, category, description, date, paymentMethod, tags } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: "userId and amount are required" });
    }

    const expense = new Expense({
      userId,
      amount,
      category,
      description,
      date: date || new Date(),
      paymentMethod,
      tags,
    });

    await expense.save();
    res.json({ success: true, expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's expenses
router.get("/expenses/:userId", async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json({ success: true, expenses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get expense summary (monthly/weekly)
router.get("/expenses/summary/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { period = "month" } = req.query;

    let startDate = new Date();
    if (period === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === "month") {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const expenses = await Expense.find({
      userId,
      date: { $gte: startDate },
    });

    const summary = {};
    expenses.forEach((exp) => {
      summary[exp.category] = (summary[exp.category] || 0) + exp.amount;
    });

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({ success: true, summary, total, period, count: expenses.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
router.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== USER ROUTES ====================

// Create/update user
router.post("/users/register", async (req, res) => {
  try {
    const { whatsappNumber, name, language } = req.body;

    let user = await User.findOne({ whatsappNumber });

    if (user) {
      user.lastInteraction = new Date();
      if (name) user.name = name;
      if (language) user.language = language;
      await user.save();
    } else {
      user = new User({
        whatsappNumber,
        name,
        language: language || "hi",
        isWhatsappUser: !!whatsappNumber,
      });
      await user.save();
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user data
router.get("/users/:userId", async (req, res) => {
  try {
    const user = await User.findOne({
      $or: [{ _id: req.params.userId }, { whatsappNumber: req.params.userId }],
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DASHBOARD ROUTE ====================

// Get complete dashboard data
router.get("/dashboard/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const [medicines, expenses, user] = await Promise.all([
      Medicine.find({ userId, isActive: true }),
      Expense.find({ userId }).sort({ date: -1 }).limit(10),
      User.findOne({
        $or: [{ _id: userId }, { whatsappNumber: userId }],
      }),
    ]);

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const expenseByCategory = {};
    expenses.forEach((exp) => {
      expenseByCategory[exp.category] = (expenseByCategory[exp.category] || 0) + exp.amount;
    });

    res.json({
      success: true,
      user,
      medicines: medicines.length,
      medicinesList: medicines,
      totalExpenses,
      expenseCount: expenses.length,
      expenseByCategory,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
