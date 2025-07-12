const Expense = require('../models/Expense');

// Add new expense
exports.addExpense = async (req, res) => {
  try {
    const { amount, category, description, date, recurring } = req.body;
    
    const expense = await Expense.create({
      userId: req.user._id,
      amount,
      category,
      description,
      date: date || Date.now(),
      recurring
    });

    res.status(201).json({
        success: true,
        message :'Expense added successfully',
        expense,
    });
  } catch (err) {
    console.error('Expense not created', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all expenses with filters
exports.getExpenses = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;
    const filters = { userId: req.user._id };

    if (startDate && endDate) {
      filters.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (category) {
      filters.category = category;
    }

    const expenses = await Expense.find(filters).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get expense summary by category
exports.getExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { userId: req.user._id };

    if (startDate && endDate) {
      match.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const summary = await Expense.aggregate([
      { $match: match },
      { 
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an expense
exports.updateExpense = async (req, res) => {
  try {
    const { amount, category, description, date, recurring } = req.body;
    
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        amount,
        category,
        description,
        date: date || Date.now(),
        recurring
      },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an expense
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!expense) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};