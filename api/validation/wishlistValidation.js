const Joi = require('joi');

const wishlistValidation = Joi.object({
  product_variant_id: Joi.number().integer().required().messages({
    'number.base': 'product variant ID must be a number.',
    'any.required': 'Category ID is required.',
  }),
});

module.exports = {
  wishlistValidation,
};
