import createHttpError from 'http-errors'
import jwt from 'jsonwebtoken'
import fs from 'node:fs/promises'
import handlebars from 'handlebars'
import path from 'node:path'

import {
  findUser,
  resetUserPassword,
  signupUser,
  updateVerifyUser,
} from '../services/authServices.js'
import { compareHash, hashValue } from '../utils/hash.js'
import {
  createSession,
  deleteSession,
  findSession,
} from '../services/sessionServices.js'
import { env } from '../utils/env.js'

import { TEMPLATES_DIR } from '../constants/constants.js'

import { sendEmail } from '../utils/sendMail.js'
import {
  generateAuthUrl,
  getGoogleOAuthName,
  validateGoogleOAuthCode,
} from '../utils/googleOAuth2.js'
import { randomBytes } from 'node:crypto'

const appDomain = env('APP_DOMAIN')
const jwtSecret = env('JWT_SECRET')
const templateDirHTML = path.join(TEMPLATES_DIR, 'verifyEmail.html')
const templateDirResetPassHTML = path.join(TEMPLATES_DIR, 'resetPassword.html')

export const signupUserController = async (req, res) => {
  const { email } = req.body
  const unicUser = await findUser({ email })
  if (unicUser) {
    throw createHttpError(409, 'Email in use')
  }

  const newUser = await signupUser(req.body)

  // Потрібно для jsonwebtoken
  const payload = {
    id: newUser._id,
    email,
  }
  const token = jwt.sign(payload, jwtSecret, { expiresIn: '24h' })

  // Читаємо, html-файл знаходиться у шаблоні src/templates (для гарного повідомлення у листі)
  const emailTemplateSource = await fs.readFile(templateDirHTML, 'utf-8')
  const emailTemplate = handlebars.compile(emailTemplateSource)
  const html = emailTemplate({
    projectName: 'GoIT verify email for CONTACTS',
    appDomain,
    token,
  })

  // Потрібно для nodemailer
  const verifyEmail = {
    subject: 'Verify Email',
    to: email,
    html,
  }

  await sendEmail(verifyEmail)

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

export const verifyController = async (req, res) => {
  const { token } = req.query
  try {
    const { id, email } = jwt.verify(token, jwtSecret)
    const user = await findUser({ _id: id, email })

    if (!user) {
      throw createHttpError(404, 'User not found')
    }

    await updateVerifyUser({ email }, { verify: true })

    res.json({
      status: 200,
      message: 'Email verified successfully',
    })
  } catch (error) {
    throw createHttpError(401, error.message)
  }
}

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body

  try {
    const { id, email } = jwt.verify(token, jwtSecret)
    const user = await findUser({ _id: id, email })

    if (!user) {
      throw createHttpError(404, 'User not found')
    }

    const encryptedPassword = await hashValue(password)

    await resetUserPassword({ email }, { password: encryptedPassword })

    res.json({
      message: 'Password was successfully reset!',
      status: 200,
      data: {},
    })
  } catch (error) {
    if (
      error.name === 'TokenExpiredError' ||
      error.name === 'JsonWebTokenError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.')
    }
    throw createHttpError(401, error.message)
  }
}

export const resetPasswordMessageController = async (req, res) => {
  res.status(200).json({
    message: 'Thank you! Now u can start changing your password.',
  })
}

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body

  const user = await findUser({ email })

  if (!user) {
    throw createHttpError(404, 'User not found')
  }

  // Потрібно для jsonwebtoken
  const payload = {
    id: user._id,
    email,
  }

  const token = jwt.sign(payload, jwtSecret, { expiresIn: '5m' })

  // Читаємо, html-файл знаходиться у шаблоні src/templates (для гарного повідомлення у листі)
  const emailTemplateSource = await fs.readFile(
    templateDirResetPassHTML,
    'utf-8',
  )
  const emailTemplate = handlebars.compile(emailTemplateSource)
  const html = emailTemplate({
    projectName: 'GoIT reset password for CONTACTS',
    appDomain,
    token,
  })

  // Потрібно для nodemailer
  const resetPassword = {
    subject: 'Reset Password',
    to: email,
    html,
  }

  await sendEmail(resetPassword)

  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  })
}

export const signinUserController = async (req, res) => {
  const { email, password } = req.body
  const user = await findUser({ email })
  if (!user) {
    throw createHttpError(401, 'Email is not registered')
  }

  if (!user.verify) {
    throw createHttpError(401, 'Email is not verified!')
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

export const getGoogleOAuthController = async (req, res) => {
  const url = generateAuthUrl()

  res.json({
    status: 200,
    message: 'Google OAuth url generate successfully',
    data: {
      url,
    },
  })
}

export const authGoogleController = async (req, res) => {
  const { code } = req.body
  const ticket = await validateGoogleOAuthCode(code)
  const userPayload = ticket.getPayload()
  if (!userPayload) {
    throw createHttpError(401, 'No data in authGoogleController')
  }

  let user = await findUser({ email: userPayload.email })

  if (!user) {
    // Ім'я є у даних з https://www.googleapis.com/auth/userinfo.profile (userPayload) такі, як given_name та family_name у функції getGoogleOAuthName

    const signupData = {
      email: userPayload.email,
      name: getGoogleOAuthName(userPayload),
      password: randomBytes(10),
    }

    user = await signupUser(signupData)
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
