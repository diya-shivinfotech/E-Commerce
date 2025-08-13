const Joi = require('joi');

const listStatesSchema = Joi.object({
  country_id: Joi.string()
    .required()
    .label('country_id')
    .messages({
      'any.required': 'country_id is required.',
      'string.empty': 'country_id is required.',
    }),
});

const listCitiesSchema = Joi.object({
  state_id: Joi.string()
    .required()
    .label('state_id')
    .messages({
      'any.required': 'state_id is required.',
      'string.empty': 'state_id is required.',
    }),
});

module.exports = {
    listStatesSchema,
    listCitiesSchema,
}