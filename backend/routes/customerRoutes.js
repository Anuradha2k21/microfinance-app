const express = require('express');
const {
  addCustomer,
  getAllCustomers,
  editCustomer,
  deleteCustomer,
  getCustomerById,
} = require('../controllers/customerController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router
  .route('/')
  .post(protect, addCustomer)
  .get(protect, getAllCustomers);

router
  .route('/:id')
  .get(protect, getCustomerById)
  .put(protect, editCustomer)
  .delete(protect, deleteCustomer);

module.exports = router;