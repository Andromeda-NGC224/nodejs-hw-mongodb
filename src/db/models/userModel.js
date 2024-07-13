import { Schema, model } from 'mongoose'

import { emailRegex } from '../../constants/userConstants.js'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegex,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

userSchema.post('save', (error, data, next) => {
  // Для виправлення помилки 500 при невірних даних щодо схеми та првацює лише саме при помилці, якщо операція успішна, колбек не запуститься
  const { name, code } = error
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400
  next()
})

userSchema.pre('findOneAndUpdate', function (next) {
  // options.new = true - Це повернення нового об'єкта у `res`
  this.options.new = true
  this.options.runValidators = true
  next()
})

userSchema.post('findOneAndUpdate', (error, data, next) => {
  error.status = 400
  next()
})

export const User = model('user', userSchema)
