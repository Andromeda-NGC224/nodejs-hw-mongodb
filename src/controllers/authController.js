import createHttpError from 'http-errors'

import { findUser, signupUser } from '../services/authServices.js'
import { compareHash } from '../utils/hash.js'
import {
  createSession,
  deleteSession,
  findSession,
} from '../services/sessionServices.js'

export const signupUserController = async (req, res) => {
  const { email } = req.body
  const unicUser = await findUser({ email })
  if (unicUser) {
    throw createHttpError(409, 'Email in use')
  }

  const newUser = await signupUser(req.body)
  const dataUser = {
    name: newUser.name,
    email: newUser.email,
  }

  res.status(201).json({
    status: res.statusCode,
    message: 'Successfully registered a user!',
    data: dataUser,
  })
}

export const signinUserController = async (req, res) => {
  const { email, password } = req.body
  const user = await findUser({ email })
  if (!user) {
    throw createHttpError(401, 'Email is not registered')
  }

  const passwordCompare = await compareHash(password, user.password)
  if (!passwordCompare) {
    throw createHttpError(401, 'Invalid password')
  }

  const sessionValue = await createSession(user._id)

  res.cookie('refreshToken', sessionValue.refreshToken, {
    httpOnly: true,
    expires: sessionValue.refreshTokenValidUntil,
  })

  res.cookie('sessionId', sessionValue._id, {
    httpOnly: true,
    expires: sessionValue.refreshTokenValidUntil,
  })

  res.status(200).json({
    status: res.statusCode,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: sessionValue.accessToken,
    },
  })
}

export const refreshController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies
  const currentSession = await findSession({ _id: sessionId, refreshToken })

  console.log(currentSession)

  if (!currentSession) {
    throw createHttpError(401, 'Session not found')
  }

  const refreshTokenExpired = Date.now() > currentSession.refreshTokenValidUntil

  if (refreshTokenExpired) {
    throw createHttpError(401, 'Refresh token expired')
  }

  const newSession = await createSession(currentSession.userId)

  res.cookie('refreshToken', newSession.refreshToken, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
  })

  res.cookie('sessionId', newSession._id, {
    httpOnly: true,
    expires: newSession.refreshTokenValidUntil,
  })

  res.status(200).json({
    status: res.statusCode,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: newSession.accessToken,
    },
  })
}

export const logoutController = async (req, res) => {
  if (!req.cookies.sessionId) {
    throw createHttpError(401, 'Session is not found')
  }
  await deleteSession({ _id: req.cookies.sessionId })
  res.clearCookie('sessionId')
  res.clearCookie('refreshToken')

  res.status(204).send()
}
