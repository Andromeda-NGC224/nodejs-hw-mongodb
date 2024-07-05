import {
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
} from '../constants/constants.js'
import { Session } from '../db/models/sessionModel.js'
import { randomBytes } from 'node:crypto'

export const findSession = (value) => Session.findOne(value)

export const createSession = async (userId) => {
  await Session.deleteOne({ userId })
  // { userId } Потрібно саме як об'єкт предавати

  const accessToken = randomBytes(30).toString('base64')
  const refreshToken = randomBytes(30).toString('base64')

  const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME)
  const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME)

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  })
}
