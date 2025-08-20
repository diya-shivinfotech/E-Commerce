const Joi = require('joi');

const cartValidation = Joi.object({
  total_amount: Joi.number().required().messages({
    'number.base': 'Total amount must be a number.',
    'any.required': 'Total amount is required.',
  }),
});

const updateCartValidation = Joi.object({
  total_amount: Joi.number().required().messages({
    'number.base': 'Total amount must be a number.',
  }),
});

module.exports = {
  cartValidation,
  updateCartValidation,
};
