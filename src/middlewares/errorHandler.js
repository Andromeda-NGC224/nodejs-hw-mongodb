const errorHandler = (error, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = error
  res.status(status).json({
    status,
    message,
    data: { message: 'Contact not found' },
  })
}
export default errorHandler
