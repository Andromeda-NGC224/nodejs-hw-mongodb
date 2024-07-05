import express from 'express'
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contactsController.js'

import ctrlWrapper from '../utils/ctrlWrapper.js'
import validateBody from '../utils/validateBody.js'

import isValidId from '../middlewares/isValidId.js'
import {
  contactsAddJoiValid,
  contactsPatchJoiValid,
} from '../validation/contactsJoiValid.js'
import { authenticate } from '../middlewares/authenticate.js'

const contactsRouter = express.Router()

contactsRouter.use(authenticate)
// Перевірка логіну на всі приватні маршрути

contactsRouter.get('/', ctrlWrapper(getAllContactsController))

contactsRouter.post(
  '/',
  validateBody(contactsAddJoiValid),
  ctrlWrapper(createContactController),
)

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
)

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(contactsPatchJoiValid),
  ctrlWrapper(updateContactController),
)

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
)

export default contactsRouter
