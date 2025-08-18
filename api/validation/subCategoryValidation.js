const joi = require('joi');

const subCategoryValidation = joi.object({
  category_id: joi.number().required().messages({
    'number.base': 'Category ID must be a number.',
    'any.required': 'Category ID is required.',
  }),
  name: joi.string().trim().required().min(3).messages({
    'string.base': 'Category name must be in string',
    'any.required': 'Category name is required.',
    'string.min': 'Name must be at least 3 characters long.',
  }),
});

const updatesubCategoryValidation = joi.object({
  category_id: joi.number().optional().messages({
    'number.base': 'Category ID must be a number.',
  }),
  name: joi.string().trim().optional().min(3).messages({
    'string.base': 'Category name must be in string',
    'string.min': 'Name must be at least 3 characters long.',
  }),
});

module.exports = {
  subCategoryValidation,
  updatesubCategoryValidation
};
