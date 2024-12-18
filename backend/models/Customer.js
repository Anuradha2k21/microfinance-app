const mongoose = require('mongoose');
const Joi = require('joi');

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true
    },
    phone: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 15
    },
    address: {
      type: String,
      minlength: 5,
      maxlength: 255,
      required: true
    },
    loans: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Loan' }],
  },
  { timestamps: true }
);

CustomerSchema.pre('findOneAndDelete', async function(next) {
  const customerId = this.getQuery()['_id'];
  await mongoose.model('Loan').deleteMany({ customer: customerId });
  next();
});

const Customer = mongoose.model('Customer', CustomerSchema);

const validateCustomer = (customer) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phone: Joi.string().min(10).max(15).required(),
    address: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(customer);
};

module.exports = {
  Customer,
  validateCustomer
};