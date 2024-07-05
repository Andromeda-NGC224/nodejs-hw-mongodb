import { Schema, model } from 'mongoose'

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },
    refreshTokenValidUntil: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
)

sessionSchema.post('save', (error, data, next) => {
  // Для виправлення помилки 500 при невірних даних щодо схеми та првацює лише саме при помилці, якщо операція успішна, колбек не запуститься
  const { name, code } = error
  error.status = name === 'MongoServerError' && code === 11000 ? 409 : 400
  next()
})

sessionSchema.pre('findOneAndUpdate', function (next) {
  // options.new = true - Це повернення нового об'єкта у `res`
  this.options.new = true
  this.options.runValidators = true
  next()
})

sessionSchema.post('findOneAndUpdate', (error, data, next) => {
  error.status = 400
  next()
})

export const Session = model('session', sessionSchema)
