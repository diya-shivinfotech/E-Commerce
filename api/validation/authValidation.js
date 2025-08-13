const Joi = require('joi');
const { ROLE, STATUS } = require('../utils/enums');

const userValidation = Joi.object({
  name: Joi.string().trim().required().min(3).messages({
    'string.empty': 'Name is required.',
    'any.required': 'Name is required.',
    'string.min': 'Name must be at least 3 characters long.',
  }),

  email: Joi.string().email().required().messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
    'any.required': 'Email is required.',
  }),

  password: Joi.string()
    .min(6)
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
      )
    )
    .required()
    .messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 6 characters long.',
      'string.pattern.base':
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'any.required': 'Password is required.',
    }),

  confirm_password: Joi.any().equal(Joi.ref('password')).required().messages({
    'any.only': 'Confirm password does not match with the password.',
    'any.required': 'Confirm password is required.',
  }),

  phone_number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'string.empty': 'Phone number is required.',
      'string.pattern.base': 'Phone number must be a 10-digit number.',
      'any.required': 'Phone number is required.',
    }),

  profile_image: Joi.string().allow('', null),

  status: Joi.string().valid(...Object.values(STATUS)).required().messages({
    'any.only': `Status must be one of: ${Object.values(STATUS).join(', ')}`,
    'string.empty': 'Status is required.',
    'any.required': 'Status is required.',
  }),

  role: Joi.string().valid(...Object.values(ROLE)).required().messages({
    'any.only': `Role must be one of: ${Object.values(ROLE).join(', ')}`,
    'string.empty': 'Role is required.',
    'any.required': 'Role is required.',
  }),
  is_deleted: Joi.boolean().default(false).messages({
    'boolean.base': 'Is deleted must be a boolean.',
  }),
});

const loginValidation = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email ID is required.',
    'string.email': 'Email ID must be a valid email address.',
    'any.required': 'Email ID is required.',
  }),
  password: Joi.string()
    .min(6)
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,}$'
      )
    )
    .required()
    .messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 6 characters long.',
      'string.pattern.base':
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      'any.required': 'Password is required.',
    }),
});

const changePasswordValidation = Joi.object({
  old_password: Joi.string().required().messages({
    'string.empty': 'Old password is required.',
    'any.required': 'Old password is required.',
  }),

  new_password: Joi.string().required().messages({
    'string.empty': 'New password is required.',
    'any.required': 'New password is required.',
  }),

  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref('new_password'))
    .messages({
      'any.only': 'New password and confirm password do not match.',
      'string.empty': 'Confirm password is required.',
      'any.required': 'Confirm password is required.',
    }),
}).custom((value, helpers) => {
  if (value.old_password === value.new_password) {
    return helpers.message('New password must not be same as old password.');
  }
  return value;
});


const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.empty': 'Email ID is required.',
    'string.email': 'Email ID must be valid.',
    'any.required': 'Email ID is required.',
  }),
  otp: Joi.number().integer().min(100000).max(999999).required().messages({
    'number.base': 'OTP must be a number.',
    'number.min': 'OTP must be a 6-digit number.',
    'number.max': 'OTP must be a 6-digit number.',
    'any.required': 'OTP is required.',
  }),
  new_password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
    .required()
    .messages({
      'string.empty': 'Password is required.',
      'string.min': 'Password must be at least 8 characters.',
      'string.pattern.base':
        'Password must include uppercase, lowercase, number, and special character.',
      'any.required': 'Password is required.',
    }),
  confirm_password: Joi.string().required().valid(Joi.ref('new_password')).messages({
    'any.only': 'New password and confirm password does not match.',
    'string.empty': 'Confirm password is required.',
    'any.required': 'Confirm password is required.',
  }),
});

module.exports = {userValidation, loginValidation, changePasswordValidation, resetPasswordSchema};
