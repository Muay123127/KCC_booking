export type ApiCollectionResponse<T> =
  | T[]
  | {
      results?: T[]
      data?: T[]
      bookings?: T[]
      events?: T[]
    }
