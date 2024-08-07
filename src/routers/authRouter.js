import { Router } from 'express'

import ctrlWrapper from '../utils/ctrlWrapper.js'
import validateBody from '../utils/validateBody.js'

import {
  googleOAuthCodeJoi,
  userSigninJoi,
  userSignupJoi,
} from '../validation/userJoiValid.js'

import {
  signupUserController,
  signinUserController,
  refreshController,
  logoutController,
  verifyController,
  requestResetEmailController,
  resetPasswordMessageController,
  resetPasswordController,
  getGoogleOAuthController,
  authGoogleController,
} from '../controllers/authController.js'
import {
  requestResetEmailJoi,
  resetPasswordJoi,
} from '../validation/authEmail.js'

const authRouter = Router()

authRouter.post(
  '/register',
  validateBody(userSignupJoi),
  ctrlWrapper(signupUserController),
)

authRouter.get('/verify', ctrlWrapper(verifyController))

authRouter.get('/get-oath-url', ctrlWrapper(getGoogleOAuthController))

authRouter.post(
  '/confirm-google-oauth',
  validateBody(googleOAuthCodeJoi),
  ctrlWrapper(authGoogleController),
)

authRouter.get('/reset-password', ctrlWrapper(resetPasswordMessageController))

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordJoi),
  ctrlWrapper(resetPasswordController),
)

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailJoi),
  ctrlWrapper(requestResetEmailController),
)

authRouter.post(
  '/login',
  validateBody(userSigninJoi),
  ctrlWrapper(signinUserController),
)

authRouter.post('/refresh', ctrlWrapper(refreshController))

authRouter.post('/logout', ctrlWrapper(logoutController))

export default authRouter
