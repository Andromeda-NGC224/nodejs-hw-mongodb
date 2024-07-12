import Joi from 'joi'
import { emailRegex } from '../constants/userConstants.js'

export const requestResetEmailJoi = Joi.object({
  email: Joi.string().pattern(emailRegex).min(3).required(),
})

export const resetPasswordJoi = Joi.object({
  password: Joi.string().required(),
  token: Joi.string().required(),
})
