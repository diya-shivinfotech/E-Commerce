const Joi = require('joi');

const reviewValidation = Joi.object({
  product_variant_id: Joi.number().integer().required().messages({
    'number.base': 'product variant ID must be a number.',
    'any.required': 'Category ID is required.',
  }),
  ratings: Joi.number().min(1).max(5).required().messages({
    'number.base': 'Ratings must be a number.',
    'number.min': 'Ratings must be at least 1.',
    'number.max': 'Ratings must be 5 or less.',
    'any.required': 'Ratings is required.',
  }),
  comments: Joi.string().optional().messages({
    'string.base': 'Comments must be a string.',
  }),
  image: Joi.string().optional().allow('').messages({
    'string.base': 'Image must be a string (URL, path, or name).',
  }),
});

const updateReviewValidation = Joi.object({
  product_variant_id: Joi.number().integer().optional().messages({
    'number.base': 'product variant ID must be a number.',
  }),
  ratings: Joi.number().min(1).max(5).optional().messages({
    'number.base': 'Ratings must be a number.',
    'number.min': 'Ratings must be at least 1.',
    'number.max': 'Ratings must be 5 or less.',
  }),
  comments: Joi.string().optional().messages({
    'string.base': 'Comments must be a string.',
  }),
  image: Joi.string().optional().allow('').messages({
    'string.base': 'Image must be a string (URL, path, or name).',
  }),
});

module.exports = {
  reviewValidation,
  updateReviewValidation,
};
