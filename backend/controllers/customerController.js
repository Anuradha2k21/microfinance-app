const Customer = require('../models/Customer');

// @desc    Add a new customer
// @route   POST /api/customers
// @access  Private (Admin, Loan Officer)
exports.addCustomer = async (req, res) => {
  const { name, email, phone, address } = req.body;

  try {
    const customer = new Customer({ name, email, phone, address });
    await customer.save();
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error adding customer", error: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private (Admin, Loan Officer)
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate('loans');
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customers", error: error.message });
  }
};

// @desc    Get a single customer
// @route   GET /api/customers/:id
// @access  Protected
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("loans");
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer", error: error.message });
  }
};

// @desc    Edit a customer
// @route   PUT /api/customers/:id
// @access  Private (Admin, Loan Officer)
exports.editCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    const customer = await Customer.findByIdAndUpdate(
      id,
      { name, email, phone, address },
      { new: true }
    );
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin, Loan Officer)
exports.deleteCustomer = async (req, res) => {
  const { id } = req.params;

  try {
    await Customer.findByIdAndDelete(id);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};