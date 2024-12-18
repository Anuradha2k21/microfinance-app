const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true },
    phone: { type: String, required: true },
    address: { type: String },
    loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', CustomerSchema);