const express = require('express');
const {
  recordLoan,
  getAllLoans,
  getLoanById,
  updateLoan,
} = require('../controllers/loanController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router
  .route('/')
  .post(protect, recordLoan)
  .get(protect, getAllLoans);

router
  .route('/:id')
  .put(protect, updateLoan)
  .get(protect, getLoanById);

module.exports = router;