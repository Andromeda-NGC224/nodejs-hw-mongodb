import { Schema, model } from 'mongoose'
import { contactType } from '../../constants/constants.js'

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: contactType,
      required: true,
      default: 'personal',
    },
    photo: {
      type: String,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

contactsSchema.post('save', (error, data, next) => {
  // Для виправлення помилки 500 при невірних даних щодо схеми та првацює лише саме при помилці, якщо операція успішна, колбек не запуститься
  error.status = 400
  next()
})

contactsSchema.pre('findOneAndUpdate', function (next) {
  // options.new = true - Це повернення нового об'єкта у `res`
  this.options.new = true
  this.options.runValidators = true
  next()
})

contactsSchema.post('findOneAndUpdate', (error, data, next) => {
  error.status = 400
  next()
})
export const Contact = model('contacts', contactsSchema)
