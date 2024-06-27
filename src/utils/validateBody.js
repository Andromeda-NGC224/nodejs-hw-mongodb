import createHttpError from 'http-errors'

export const validateBody = (schemaJoi) => {
  const foo = async (req, res, next) => {
    try {
      await schemaJoi.validateAsync(req.body, {
        abortEarly: false,
      })
      next()
    } catch (error) {
      const responseError = createHttpError(400, error.message)
      next(responseError)
    }
  }
  return foo
}

export default validateBody
