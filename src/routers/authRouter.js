import { Router } from 'express'

import ctrlWrapper from '../utils/ctrlWrapper.js'
import validateBody from '../utils/validateBody.js'

import { userSigninJoi, userSignupJoi } from '../validation/userJoiValid.js'

import {
  signupUserController,
  signinUserController,
  refreshController,
  logoutController,
  verifyController,
} from '../controllers/authController.js'

const authRouter = Router()

authRouter.post(
  '/register',
  validateBody(userSignupJoi),
  ctrlWrapper(signupUserController),
)

authRouter.get('/verify', ctrlWrapper(verifyController))

authRouter.post(
  '/login',
  validateBody(userSigninJoi),
  ctrlWrapper(signinUserController),
)

authRouter.post('/refresh', ctrlWrapper(refreshController))

authRouter.post('/logout', ctrlWrapper(logoutController))

export default authRouter
