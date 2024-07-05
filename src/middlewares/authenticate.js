import createHttpError from 'http-errors'
import { findSession } from '../services/sessionServices.js'
import { findUser } from '../services/authServices.js'

export const authenticate = async (req, res, next) => {
  const authHeaderBearer = req.get('Authorization')

  if (!authHeaderBearer) {
    return next(createHttpError(401, 'Authorization header missing'))
  }
  const [bearer, accessToken] = authHeaderBearer.split(' ')

  if (bearer !== 'Bearer') {
    return next(createHttpError(401, 'Authorization must be Bearer type'))
  }
  if (!accessToken) {
    return next(createHttpError(401, 'There is no token'))
  }

  const sessionIsActive = await findSession({ accessToken })

  if (!sessionIsActive) {
    return next(createHttpError(401, 'Session is not active'))
  }

  const accessTokenExpired = Date.now() > sessionIsActive.accessTokenValidUntil

  if (accessTokenExpired) {
    return next(createHttpError(401, 'Access token expired'))
  }

  const user = await findUser({ _id: sessionIsActive.userId })

  if (!user) {
    return next(createHttpError(401, 'No user with such ID'))
  }

  req.user = user

  next()
}
