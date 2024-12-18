const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    repaymentSchedule: { type: String, enum: ["monthly", "annually"], default: "monthly" },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'overdue', 'repaid'], default: 'active' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Loan', LoanSchema);