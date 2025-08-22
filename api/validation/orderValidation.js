const Joi = require('joi');
const { Status } = require('../utils/enums');

const orderValidation = Joi.object({
  address_id: Joi.number().required().messages({
    'number.base': 'Address ID must be a number.',
    'any.required': 'Address ID is required.',
  }),
  product_variant_id: Joi.number().required().messages({
    'number.base': 'Product variant ID must be a number.',
    'any.required': 'Product variant ID is required.',
  }),
  quantity: Joi.number().required().messages({
    'number.base': 'Quantity amount must be a number.',
    'any.required': 'Quantity amount is required.',
  }),
  shipping_address: Joi.string().required().messages({
    'string.base': 'Shipping address must be a string.',
    'any.required': 'Shipping address is required.',
  }),
  billing_address: Joi.string().required().messages({
    'string.base': 'Billing address must be a string.',
    'any.required': 'Billing address is required.',
  }),
});

const updateOrderValidation = Joi.object({
  address_id: Joi.number().optional().messages({
    'number.base': 'Address ID must be a number.',
  }),
  product_variant_id: Joi.number().optional().messages({
    'number.base': 'Product variant ID must be a number.',
  }),
  quantity: Joi.number().optional().messages({
    'number.base': 'Quantity amount must be a number.',
  }),
  status: Joi.string()
    .valid(Status.PROGRESS, Status.CANCELLED, Status.DELIVERED)
    .default(Status.PROGRESS)
    .messages({
      'any.only': 'Status must be one of [Progress, Cancelled, Delivered].',
      'string.base': 'Status must be a valid string.',
    }),
  shipping_address: Joi.string().optional().messages({
    'string.base': 'Shipping address must be a string.',
  }),
  billing_address: Joi.string().optional().messages({
    'string.base': 'Billing address must be a string.',
  }),
});

module.exports = {
  orderValidation,
  updateOrderValidation,
};
