const { Customer } = require('../models/Customer');
const Loan = require('../models/Loan');

exports.recordLoan = async (req, res) => {
  const { customerId, amount, interestRate, dueDate } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    const newLoan = new Loan({
      customer: customerId,
      amount,
      interestRate,
      dueDate,
      status: "active",
    });

    const savedLoan = await newLoan.save();

    // Update customer's loans
    customer.loans.push(savedLoan._id);
    await customer.save();

    res.status(201).json(savedLoan);
  } catch (error) {
    res.status(500).json({ message: "Error adding loan", error: error.message });
  }
};

exports.getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate('customer');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate("customer", "name email phone");
    if (!loan) return res.status(404).json({ message: "Loan not found" });

    res.status(200).json(loan);
  } catch (error) {
    res.status(500).json({ message: "Error fetching loan", error: error.message });
  }
};

exports.updateLoan = async (req, res) => {
  try {
    const updatedLoan = await Loan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedLoan) return res.status(404).json({ message: "Loan not found" });

    res.status(200).json(updatedLoan);
  } catch (error) {
    res.status(500).json({ message: "Error updating loan", error: error.message });
  }
};