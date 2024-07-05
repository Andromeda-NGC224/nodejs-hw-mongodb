import { User } from '../db/models/userModel.js'
import { hashValue } from '../utils/hash.js'

export const findUser = async (filter) => {
  const unicUser = User.findOne(filter)
  return unicUser
}

export const signupUser = async (data) => {
  const { password } = data
  const hashPassword = await hashValue(password)
  const user = await User.create({ ...data, password: hashPassword })
  return user
}
