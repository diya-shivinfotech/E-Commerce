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
  status: Joi.string()
    .valid(Status.PROGRESS, Status.DELIVERED, Status.CANCELLED)
    .default(Status.PROGRESS)
    .messages({
      'any.only': `Status must be one of: ${Status.PROGRESS}, ${Status.DELIVERED}, ${Status.CANCELLED}.`,
      'string.base': 'Status must be a string.',
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
  status: Joi.string()
    .valid(Status.PROGRESS, Status.DELIVERED, Status.CANCELLED)
    .optional()
    .messages({
      'any.only': `Status must be one of: ${Status.PROGRESS}, ${Status.DELIVERED}, ${Status.CANCELLED}.`,
      'string.base': 'Status must be a string.',
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
