const parseSortParams = (query, allContactFieldList) => {
  const { sortBy, sortOrder } = query
  const parsedSortOrder = ['asc', 'desc'].includes(sortOrder)
    ? sortOrder
    : 'asc'
  const parsedSortBy = allContactFieldList.includes(sortBy) ? sortBy : '_id'
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  }
}

export default parseSortParams
