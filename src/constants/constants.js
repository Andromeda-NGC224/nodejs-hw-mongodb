import path from 'node:path'

export const contactType = ['work', 'home', 'personal']
export const allContactFieldList = [
  '_id',
  'name',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
  'createdAt',
  'updatedAt',
]

export const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000

export const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000

// resolve спочатку об'єднує шляхи, а потім автоматично підставляє до початку абсолютний шлях.
export const TEMPLATES_DIR = path.resolve('src', 'templates')
