import { Contact } from '../db/models/contactModel.js'

export const getAllContacts = async () => {
  const contacts = await Contact.find()
  return contacts
}

export const getContactById = async (contactId) => {
  try {
    const contact = await Contact.findById(contactId)
    return contact
  } catch (error) {
    console.log(error.message)
  }
}
