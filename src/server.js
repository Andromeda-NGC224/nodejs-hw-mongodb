import express from 'express'
import pino from 'pino-http'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from '../src/utils/env.js'

import contactsRouter from './routers/contactsRouter.js'
import authRouter from './routers/authRouter.js'

import notFoundMiddleware from './middlewares/notFoundHandler.js'
import errorHandler from './middlewares/errorHandler.js'

import { PUBLIC_DIR } from './constants/constants.js'
import { swaggerDocs } from './middlewares/swaggerDocs.js'

const PORT = Number(env('PORT', '3000'))

const setupServer = () => {
  const app = express()

  app.use(express.json())
  app.use(cors())
  app.use(cookieParser())
  app.use(express.static(PUBLIC_DIR))

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  )

  app.use('/api-docs', swaggerDocs())
  app.use('/auth', authRouter)
  app.use('/contacts', contactsRouter)

  app.get('/', (req, res) => {
    res.json({ message: 'Living' })
  })
  app.use('*', notFoundMiddleware)
  app.use(errorHandler)

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

export default setupServer
