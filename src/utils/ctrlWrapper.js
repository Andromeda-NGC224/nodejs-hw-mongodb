const ctrlWrapper = (controller) => {
  const foo = async (req, res, next) => {
    try {
      await controller(req, res, next)
    } catch (error) {
      next(error)
    }
  }
  return foo
}
export default ctrlWrapper
