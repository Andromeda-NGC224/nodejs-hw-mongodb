import setupServer from '../src/server.js'
import initMongoConnection from '../src/db/initMongoConnection.js'
import { createDirIfNotExists } from './utils/createDirIfNotExists.js'
import { PUBLIC_DIR, TEMP_UPLOAD_DIR } from './constants/constants.js'

const bootstrap = async () => {
  await initMongoConnection()
  await createDirIfNotExists(TEMP_UPLOAD_DIR)
  await createDirIfNotExists(PUBLIC_DIR)
  setupServer()
}

bootstrap()
