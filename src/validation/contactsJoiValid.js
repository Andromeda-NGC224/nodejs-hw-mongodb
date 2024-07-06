import Joi from 'joi'
import { contactType } from '../constants/constants.js'

export const contactsAddJoiValid = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Імя повинно бути рядком',
    'string.min': 'Імя повинно повинно мати не менше 3 символів',
    'string.max': 'Імя повинно повинно мати не більше 20 символів',
    'any.required': 'Поле з імям - обовязкове',
  }),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactType),
})

export const contactsPatchJoiValid = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Імя повинно бути текстом',
    'string.min': 'Імя повинно повинно мати не менше 3 символів',
    'string.max': 'Імя повинно повинно мати не більше 20 символів',
  }),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...contactType),
})
