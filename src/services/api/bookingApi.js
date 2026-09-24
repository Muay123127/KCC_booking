import http from './http.ts';
import { API_ENDPOINTS } from './endpoints.ts';
import { normalizeCollection } from '@/shared/utils/normalizeCollection.ts';
import { normalizeBooking } from '@/shared/utils/normalizeBooking.ts';

/**
 * ดึงรายการจองทั้งหมด 
 * Endpoint: GET /api/bookings
 * ตัวนี้เหมือนbackendจะตั้งชื่อผิดเพราะของมูล returned เป็น all of room and car list  แต่ endpoint ชื่อ bookings
 * if give type_id=1 will return only room list
 * if give type_id=2 will return only car list
 */
export const getRoomsAndCarsList = async (type_id) => {
  const response = await http.get(API_ENDPOINTS.bookings.list, {
    params: { type_id },
  });
  const bookings = normalizeCollection(response.data);
  const normalizedBookings = bookings.map(normalizeBooking);
  return normalizedBookings;
};

/**
 * ดึงรายการจองตามห้องที่เลือก show in page of room or car detail
 * Endpoint: GET /api/booking/events?booking_id=2
 * ตัวนี้คือ list of booking events in room or car use in ฺBookingEventsView.vue
 */
export const getBookingEvents = async (bookingId) => {
  const response = await http.get(API_ENDPOINTS.bookings.events, {
    params: { booking_id: bookingId },
  });
  const events = normalizeCollection(response.data).map(normalizeBooking);
  return events;
};

/**
 * ดึงข้อมูลlist of booking in room or car show in Upcoming booking list use in ResourceGrid.vue
 * Endpoint: GET /api/booking/detail
 * Body: { booking_id: 2 }
 */
export const getBookingDetail = async (bookingId) => {

  try {
    const response = await http.get(API_ENDPOINTS.bookings.detail, {
      params: { booking_id: bookingId },
      data: { booking_id: bookingId },
    });
    const details = normalizeCollection(response.data).map(normalizeBooking);
    return details;
  }
  catch (error) {
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await http.post(API_ENDPOINTS.bookings.create, bookingData);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export default http;
