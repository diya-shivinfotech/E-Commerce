const joi = require('joi');

const addressValidation = joi.object({
  country_id: joi.number().required().messages({
    'number.base': 'Country ID must be a number.',
    'any.required': 'Country ID is required.',
  }),
  state_id: joi.number().required().messages({
    'number.base': 'State ID must be a number.',
    'any.required': 'State ID is required.',
  }),
  city_id: joi.number().required().messages({
    'number.base': 'City ID must be a number.',
    'any.required': 'City ID is required.',
  }),
  address_line1: joi.string().required().messages({
    'string.base': 'Address line 1 must be a string.',
    'any.required': 'Address line 1 is required.',
  }),
  address_line2: joi.string().optional().messages({
    'string.base': 'Address line 2 must be a string.',
  }),
    zip_code: joi
    .number()
    .integer()
    .min(100000)
    .max(999999)
    .required()
    .messages({
        'number.base': 'Zip code must be a Number.',
        'number.min': 'Zip code must be exactly 6 digits.',
        'number.max': 'Zip code must be exactly 6 digits.',
        'any.required': 'Zip code is required.',
    }),
});

const updateAddressValidation = joi.object({
  country_id: joi.number().required().optional({
    'string.base': 'Country ID must be a string.',
  }),
  state_id: joi.number().optional().messages({
    'string.base': 'State ID must be a string.',
  }),
  city_id: joi.number().optional().messages({
    'string.base': 'City ID must be a string.',
  }),
  address_line1: joi.string().optional().messages({
    'string.base': 'Address line 1 must be a string.',
  }),
  address_line2: joi.string().optional().messages({
    'string.base': 'Address line 2 must be a string.',
  }),
    zip_code: joi
    .number()
    .integer()
    .min(100000)
    .max(999999)
    .optional()
    .messages({
        'number.base': 'Zip code must be a Number.',
        'number.min': 'Zip code must be exactly 6 digits.',
        'number.max': 'Zip code must be exactly 6 digits.',
    }),
});

module.exports ={
    addressValidation,
    updateAddressValidation
}