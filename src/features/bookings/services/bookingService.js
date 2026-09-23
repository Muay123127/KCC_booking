import {
  getBookingEvents,
  getBookingDetail,
  createBooking as createBookingRequest,
} from '@/app/api/bookingApi.js'

export const fetchBookings = (bookingId) => getBookingEvents(bookingId)
export const fetchBookingDetail = (bookingId) => getBookingDetail(bookingId)
export const saveBooking = (payload) => createBookingRequest(payload)
