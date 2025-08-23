const Joi = require('joi');

const cartValidation = Joi.object({
  product_variant_id: Joi.number().integer().required().messages({
    'number.base': 'product variant ID must be a number.',
    'any.required': 'Category ID is required.',
  }),
  quantity: Joi.number().required().messages({
    'number.base': 'Quantity must be a number.',
    'any.required': 'Quantity is required.',
  }),
});

const updateCartValidation = Joi.object({
  product_variant_id: Joi.number().integer().optional().messages({
    'number.base': 'product variant ID must be a number.',
  }),
  quantity: Joi.number().optional().messages({
    'number.base': 'Quantity must be a number.',
  }),
});

module.exports = {
  cartValidation,
  updateCartValidation,
};
