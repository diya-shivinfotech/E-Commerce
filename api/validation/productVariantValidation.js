const Joi = require('joi');
const { status } = require('../utils/enums');

const addProductVariantValidation = Joi.object({
  category_id: Joi.number().integer().required().messages({
    'number.base': 'Category ID must be a number.',
    'any.required': 'Category ID is required.',
  }),
  sub_category_id: Joi.number().integer().required().messages({
    'number.base': 'Sub-category ID must be a number.',
    'any.required': 'Sub-category ID is required.',
  }),
  product_id: Joi.number().integer().required().messages({
    'number.base': 'Product ID must be a number.',
    'any.required': 'Product ID is required.',
  }),
  color: Joi.string().required().messages({
    'string.base': 'Color must be a string.',
    'any.required': 'Color is required.',
  }),
  size: Joi.string().required().messages({
    'string.base': 'Size must be a string.',
    'any.required': 'Size is required.',
  }),
  material: Joi.string().required().messages({
    'string.base': 'Material must be a string.',
    'string.max': 'Material should not exceed 100 characters.',
    'any.required': 'Material is required.',
  }),
  style: Joi.string().required().messages({
    'string.base': 'Style must be a string.',
    'string.max': 'Style should not exceed 100 characters.',
    'any.required': 'Style is required.',
  }),
  price: Joi.number().required().messages({
    'number.base': 'Price must be a valid number.',
    'any.required': 'Price is required.',
  }),
  quantity: Joi.number().integer().required().messages({
    'number.base': 'Quantity must be a valid number.',
    'any.required': 'Quantity is required.',
  }),
  status: Joi.string()
    .valid(...Object.values(status))
    .required()
    .messages({
      'any.only': `Status must be one of: ${Object.values(status).join(', ')}`,
      'string.base': 'Status must be a string.',
      'any.required': 'Status is required.',
    }),
  image: Joi.string().optional().allow('').messages({
    'string.base': 'Image must be a string (URL, path, or name).',
  }),
});

const updateProductVariantValidation = Joi.object({
  category_id: Joi.number().integer().optional().messages({
    'number.base': 'Category ID must be a number.',
  }),
  sub_category_id: Joi.number().integer().optional().messages({
    'number.base': 'Sub-category ID must be a number.',
  }),
  product_id: Joi.number().integer().optional().messages({
    'number.base': 'Product ID must be a number.',
  }),
  color: Joi.string().optional().messages({
    'string.base': 'Color must be a string.',
  }),
  size: Joi.string().optional().messages({
    'string.base': 'Size must be a string.',
  }),
  material: Joi.string().optional().messages({
    'string.base': 'Material must be a string.',
    'string.max': 'Material should not exceed 100 characters.',
  }),
  style: Joi.string().optional().messages({
    'string.base': 'Style must be a string.',
    'string.max': 'Style should not exceed 100 characters.',
  }),
  price: Joi.number().optional().messages({
    'number.base': 'Price must be a valid number.',
  }),
  quantity: Joi.number().optional().messages({
    'number.base': 'Quantity must be a valid number.',
  }),
  status: Joi.string()
    .valid(...Object.values(status))
    .optional()
    .messages({
      'any.only': `Status must be one of: ${Object.values(status).join(', ')}`,
      'string.base': 'Status must be a string.',
    }),
  image: Joi.string().optional().allow('').messages({
    'string.base': 'Image must be a string (URL, path, or name).',
  }),
});

module.exports = {
  addProductVariantValidation,
  updateProductVariantValidation,
};
