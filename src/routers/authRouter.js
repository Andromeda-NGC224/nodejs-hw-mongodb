import { Router } from 'express'

import ctrlWrapper from '../utils/ctrlWrapper.js'
import validateBody from '../utils/validateBody.js'

import { userSigninJoi, userSignupJoi } from '../validation/userJoiValid.js'

import {
  signupUserController,
  signinUserController,
  refreshController,
} from '../controllers/authController.js'

const authRouter = Router()

authRouter.post(
  '/register',
  validateBody(userSignupJoi),
  ctrlWrapper(signupUserController),
)
authRouter.post(
  '/login',
  validateBody(userSigninJoi),
  ctrlWrapper(signinUserController),
)

authRouter.post('/refresh', ctrlWrapper(refreshController))

export default authRouter
