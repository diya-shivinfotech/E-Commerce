const Joi = require('joi');

const cartItemValidation = Joi.object({
  product_variant_id: Joi.number().integer().required().messages({
    'number.base': 'product variant ID must be a number.',
    'any.required': 'Category ID is required.',
  }),
  cart_id: Joi.number().integer().required().messages({
    'number.base': 'Cart ID must be a number.',
    'any.required': 'Cart ID is required.',
  }),
  quantity: Joi.number().required().messages({
    'number.base': 'Quantity must be a number.',
    'any.required': 'Quantity is required.',
  }),
  unit_price: Joi.number().required().messages({
    'number.base': 'Unit price must be a number.',
    'any.required': 'Unit price is required.',
  }),
});

const updateCartItemValidation = Joi.object({
  product_variant_id: Joi.number().integer().optional().messages({
    'number.base': 'product variant ID must be a number.',
  }),
  cart_id: Joi.number().integer().optional().messages({
    'number.base': 'Cart ID must be a number.',
  }),
  quantity: Joi.number().optional().messages({
    'number.base': 'Quantity must be a number.',
  }),
  unit_price: Joi.number().optional().messages({
    'number.base': 'Unit price must be a number.',
  }),
});

module.exports = {
  cartItemValidation,
  updateCartItemValidation,
};
