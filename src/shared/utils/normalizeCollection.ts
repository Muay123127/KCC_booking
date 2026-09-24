import type { ApiCollectionResponse } from '@/shared/types/api'

export const normalizeCollection = <T>(response: ApiCollectionResponse<T>): T[] => {
  if (Array.isArray(response)) return response

  const collection =
    response.results ||
    response.data ||
    response.bookings ||
    response.events

  return Array.isArray(collection) ? collection : []
}
