const express = require("express");
const Transaction = require("../models/Transaction");
const { authenticateUser } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/transactions
// @desc    Get all transactions for user
// @access  Private
router.get("/", authenticateUser, async (req, res) => {
  try {
    const { userId, type } = req.query;

    // Build query object dynamically
    const query = { userId };

    if (type) {
      query.type = type; // 'income' or 'expense'
    }

    const transactions = await Transaction.find(query).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/transactions
// @desc    Create new transaction
// @access  Private
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    const transaction = await Transaction.create({
      userId: req.user._id,
      type,
      amount,
      category,
      description,
      date,
    });

    // Emit real-time update to admin
    req.io.to("admin-room").emit("transaction-added", {
      transaction: {
        ...transaction.toJSON(),
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
        },
      },
    });

    res.status(201).json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update transaction
// @access  Private
router.put("/:id", authenticateUser, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // Emit real-time update to admin
    req.io.to("admin-room").emit("transaction-updated", {
      transaction: {
        ...updatedTransaction.toJSON(),
        user: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
        },
      },
    });

    res.json({
      success: true,
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction
// @access  Private
router.delete("/:id", authenticateUser, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await Transaction.findByIdAndDelete(req.params.id);

    // Emit real-time update to admin
    req.io.to("admin-room").emit("transaction-deleted", {
      transactionId: req.params.id,
      user: {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
      },
    });

    res.json({
      success: true,
      message: "Transaction deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/transactions/stats
// @desc    Get user transaction statistics
// @access  Private
router.get("/stats", authenticateUser, async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id });

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthIncome = transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.type === "income" &&
          tDate.getMonth() === currentMonth &&
          tDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const thisMonthExpenses = transactions
      .filter((t) => {
        const tDate = new Date(t.date);
        return (
          t.type === "expense" &&
          tDate.getMonth() === currentMonth &&
          tDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const recentTransactions = transactions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

    res.json({
      success: true,
      stats: {
        totalBalance: totalIncome - totalExpenses,
        totalIncome,
        totalExpenses,
        thisMonthIncome,
        thisMonthExpenses,
        totalTransactions: transactions.length,
        recentTransactions,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
