import createHttpError from 'http-errors'

import { findUser, signupUser } from '../services/authServices.js'
import { compareHash } from '../utils/hash.js'
import { createSession } from '../services/sessionServices.js'

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
}
