import Joi from 'joi'
import { emailRegex } from '../constants/userConstants.js'

export const userSignupJoi = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Імя повинно бути рядком',
    'string.min': 'Імя повинно повинно мати не менше 3 символів',
    'string.max': 'Імя повинно повинно мати не більше 20 символів',
    'any.required': 'Поле з імям - обовязкове',
  }),
  email: Joi.string().pattern(emailRegex).min(3).required(),
  password: Joi.string().min(3).max(20).required(),
})

export const userSigninJoi = Joi.object({
  email: Joi.string().pattern(emailRegex).min(3).required(),
  password: Joi.string().required(),
})

export const googleOAuthCodeJoi = Joi.object({
  code: Joi.string().required(),
})
