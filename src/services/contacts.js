import { Contact } from '../db/models/contactModel.js'
import calcPaginationData from '../utils/calcPaginationData.js'

export const getAllContacts = async ({
  filter,
  page,
  perPage,
  sortBy,
  sortOrder,
}) => {
  const skipPage = (page - 1) * perPage
  const request = Contact.find()
  if (filter.type) {
    console.log('Applying type filter:', filter.type)
    request.where('contactType').equals(filter.type)
  }
  if (filter.isFavourite !== null) {
    request.where('isFavourite').equals(filter.isFavourite)
  }
  const contacts = await request
    .skip(skipPage)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder })
  const totalItems = await Contact.find().merge(request).countDocuments()
  const { totalPages, hasNextPage, hasPreviousPage } = calcPaginationData({
    total: totalItems,
    page,
    perPage,
  })
  return {
    contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  }
}

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId)
  return contact
}

export const createContact = async (payload) => {
  const contact = await Contact.create(payload)
  return contact
}
export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
  })

  return contact
}

export const updateContact = async (contactId, payload, options = {}) => {
  const contact = await Contact.findOneAndUpdate(
    {
      _id: contactId,
    },
    payload,
    {
      ...options,
    },
  )
  return contact
}
