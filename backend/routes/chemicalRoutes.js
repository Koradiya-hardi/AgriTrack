const express = require('express');
const router = express.Router();
const {
  addChemical,
  getChemicalsByCrop,
  getChemicalReport
} = require('../controllers/chemicalController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.post('/', authMiddleware, addChemical);
router.get('/crop/:cropId', authMiddleware, getChemicalsByCrop);
router.get('/report', authMiddleware, getChemicalReport);

module.exports = router;