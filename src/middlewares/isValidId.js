import createHttpError from 'http-errors'
import { isValidObjectId } from 'mongoose'

const isValidId = (req, res, next) => {
  const { contactId } = req.params
  if (!isValidObjectId(contactId)) {
    return next(createHttpError(404, `${contactId} is not valid ID`))
  }
  next()
}
export default isValidId
