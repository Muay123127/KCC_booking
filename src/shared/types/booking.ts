export type RawBooking = Record<string, any>

export type NormalizedBooking = RawBooking & {
  id?: string | number
  code: string | number
  title: string
  room: string
  start_time: string
  end_time: string
  duration: string | number
  requester: string
  create_uid: RawBooking | string
  start_date: string
  stop_date: string
  stop_time: string
  department: string
  status: string
  description_text: string
  bookings?: NormalizedBooking[]
}
