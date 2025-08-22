const Joi = require('joi');
const { Status } = require('../utils/enums');

const orderValidation = Joi.object({
  address_id: Joi.number().required().messages({
    'number.base': 'Address ID must be a number.',
    'any.required': 'Address ID is required.',
  }),
  total_amount: Joi.number().required().messages({
    'number.base': 'Total amount must be a number.',
    'any.required': 'Total amount is required.',
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
  total_amount: Joi.number().positive().optional().messages({
    'number.base': 'Total amount must be a number.',
    'number.positive': 'Total amount must be greater than zero.',
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
