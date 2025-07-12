const express = require('express');
const router = express.Router();
const {
  addExpense,
  getExpenses,
  getExpenseSummary,
  updateExpense,
  deleteExpense
} = require('../controllers/expenseController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authMiddleware, addExpense);
router.get('/', authMiddleware, getExpenses);
router.get('/summary', authMiddleware, getExpenseSummary);
router.put('/:id', authMiddleware, updateExpense);
router.delete('/:id', authMiddleware, deleteExpense);

module.exports = router;