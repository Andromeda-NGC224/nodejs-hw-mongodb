import { contactType } from '../constants/constants.js'

const parsedBool = (value) => {
  if (value === 'true') return true
  if (value === 'false') return false
  return null
}

const parseContactsFilterParams = (query) => {
  const { type, isFavourite } = query
  const parsedType = contactType.includes(type) ? type : null
  const parsedIsFavourite = parsedBool(isFavourite)
  console.log('Parsed params:', {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  })

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  }
}
export default parseContactsFilterParams
