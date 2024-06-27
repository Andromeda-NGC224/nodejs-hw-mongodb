import {
  createContact,
  getAllContacts,
  getContactById,
  deleteContact,
  updateContact,
} from '../services/contacts.js'
import createHttpError from 'http-errors'
import parsePaginationParams from '../utils/parsePaginationParams.js'
import parseSortParams from '../utils/parseSortParams.js'
import parseContactsFilterParams from '../utils/parseContactsFilterParams.js'
import { allContactFieldList } from '../constants/constants.js'

export const getAllContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query)
  const { sortBy, sortOrder } = parseSortParams(req.query, allContactFieldList)
  const filter = parseContactsFilterParams(req.query)
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  })
  res.status(200).json({
    status: res.statusCode,
    message: 'Successfully found contacts!',
    data: contacts,
  })
}

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params
  const contact = await getContactById(contactId)
  if (!contact) {
    throw createHttpError(404, 'There is no such contact, unfortunately')
  }

  res.status(200).json({
    status: res.statusCode,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  })
}

export const createContactController = async (req, res) => {
  const contact = await createContact(req.body)

  res.status(201).json({
    status: res.statusCode,
    message: `Successfully created a contact!`,
    data: contact,
  })
}
export const updateContactController = async (req, res) => {
  const { contactId } = req.params

  const contact = await updateContact(contactId, req.body)
  if (!contact) {
    throw createHttpError(404, 'There is no such contact, unfortunately')
  }

  res.status(200).json({
    status: res.statusCode,
    message: `Successfully patched a contact!`,
    data: contact,
  })
}

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params
  const contact = await deleteContact(contactId)

  if (!contact) {
    throw createHttpError(404, 'There is no such contact, unfortunately')
  }

  res.status(204).send()
}
