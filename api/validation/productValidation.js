const joi = require('joi');

const productValidation = joi.object({
  subCategory_id: joi.number().required().messages({
    'number.base': 'Category ID must be a number.',
    'any.required': 'Category ID is required.',
  }),
  name: joi.string().trim().required().min(3).messages({
    'string.base': 'Category name must be in string',
    'any.required': 'Category name is required.',
    'string.min': 'Name must be at least 3 characters long.',
  }),
  description: joi.string().trim().optional().min(3).messages({
    'string.base': 'Description must be in string',
  }),
});

module.exports = {
  productValidation,
};
