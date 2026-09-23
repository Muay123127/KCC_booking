import { getBookingEvents } from '@/app/api/bookingApi.js'
import { Bookingdetail as createBookingRequest } from '@/app/api/bookdetailAPI.js'

export const fetchBookings = (bookingId) => getBookingEvents(bookingId)

// 💡 ປ່ຽນຈາກ createBookingDetail ເປັນ createBookingRequest ໃຫ້ົງກັບຊື່ທີ່ import ມາ
export const saveBooking = (payload) => createBookingRequest(payload)