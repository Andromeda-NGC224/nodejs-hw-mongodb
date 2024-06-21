import express from 'express'
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contactsController.js'
import ctrlWrapper from '../utils/ctrlWrapper.js'
import isValidId from '../middlewares/isValidId.js'

const contactsRouter = express.Router()

contactsRouter.get('/', ctrlWrapper(getAllContactsController))

contactsRouter.post('/', ctrlWrapper(createContactController))

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
)

contactsRouter.patch('/:contactId', ctrlWrapper(updateContactController))

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
)

export default contactsRouter
