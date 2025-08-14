const joi = require('joi');

const categoryValidation = joi.object({
  name: joi.string().trim().required().min(3).messages({
    'string.base': 'Category name must be in string',
    'any.required': 'Category name is required.',
    'string.min': 'Name must be at least 3 characters long.',
  }),
  image: joi.string().optional().messages({
    string_base: 'Image URL must be valid',
  }),
});

const updateCategoryValidation = joi.object({
  name: joi.string().trim().optional().min(3).messages({
    'string.base': 'Category name must be in string',
    'string.min': 'Name must be at least 3 characters long.',
  }),
  image: joi.string().optional().messages({
    string_base: 'Image URL must be valid',
  }),
});

module.exports = { categoryValidation, updateCategoryValidation };
