const Joi = require('joi');

const orderItemValidation = Joi.object({
  order_id: Joi.number().required().messages({
    'number.base': 'Order ID must be a number.',
    'any.required': 'Order ID is required.',
  }),
  product_id: Joi.number().required().messages({
    'number.base': 'Product ID must be a number.',
    'any.required': 'Product ID is required.',
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

const updateOrderItemValidation = Joi.object({
  order_id: Joi.number().optional().messages({
    'number.base': 'Order ID must be a number.',
  }),
  product_id: Joi.number().optional().messages({
    'number.base': 'Product ID must be a number.',
  }),
  quantity: Joi.number().optional().messages({
    'number.base': 'Quantity must be a number.',
  }),
  unit_price: Joi.number().optional().messages({
    'number.base': 'Unit price must be a number.',
  }),
});

module.exports = {
  orderItemValidation,
  updateOrderItemValidation,
};
