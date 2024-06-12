import express from 'express'
import pino from 'pino-http'
import cors from 'cors'
import { env } from '../src/utils/env.js'
import { getAllContacts, getContactById } from './services/contacts.js'

const PORT = Number(env('PORT', '3000'))

const setupServer = () => {
  const app = express()

  app.use(express.json())
  app.use(cors())

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  )

  app.get('/', (req, res) => {
    res.json({ message: 'Living' })
  })

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts()
    res.status(200).json({
      status: res.statusCode,
      message: 'Successfully found contacts!',
      data: contacts,
    })
  })
  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params
    const contact = await getContactById(contactId)
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      })
      return
    }

    res.status(200).json({
      status: res.statusCode,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    })
    next()
  })

  app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' })
  })

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

export default setupServer
