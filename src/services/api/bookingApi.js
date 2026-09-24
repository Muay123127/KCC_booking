import http from './http.ts';
import { API_ENDPOINTS } from './endpoints.ts';

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
 * Endpoint: POST /api/booking/detail
 * Body: { booking_id: 2 }
 */
export const getBookingDetail = async (bookingId) => {
  console.log('[getBookingDetail] request:', { bookingId });

  try {
    const response = await http.get(API_ENDPOINTS.bookings.detail, {
      params: { booking_id: bookingId },
    });
    console.log('[getBookingDetail] raw response:', response.data);
    const details = normalizeCollection(response.data).map(normalizeBooking);
    console.log('[getBookingDetail] normalized data:', details);
    return details;
  }
  catch (error) {
    console.error('[getBookingDetail] API error:', error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await http.post(API_ENDPOINTS.bookings.create, bookingData);

    return response.data;
  } catch (error) {
    console.error("API Error (createBooking):", error);
    throw error;
  }
};

const normalizeCollection = (response) => {
  if (Array.isArray(response)) return response;

  const collection =
    response?.results ||
    response?.data ||
    response?.bookings ||
    response?.events;
  return Array.isArray(collection) ? collection : [];
};

const normalizeBooking = (item) => ({
  ...item,
  bookings: Array.isArray(item.bookings)
    ? item.bookings.map(normalizeBooking)
    : item.bookings,
  id: item.id || item.booking_id || item.event_id,
  code:
    item.code || item.booking_code || item.reference || item.booking_id || "-",
  title: item.title || item.meeting_title || item.name || "-",
  room:
    item.room ||
    item.room_name ||
    item.item_name ||
    item.item?.name ||
    item.booking_name ||
    "-",
  start_time:
    item.start_time || item.time_start || item.start || "-",
  end_time:
    item.end_time || item.stop_date || item.date_end || item.stop || "-",
  duration:
    item.duration || item.hours || calculateDuration(item.start, item.stop),
  requester:
    item.requester ||
    item.username ||
    item.user_name ||
    item.created_by ||
    item.driver_name ||
    "-",
  create_uid: item.create_uid || "-",
  start_date: item.start_date || "-",
  stop_date: item.stop_date || item.start_date || "-",
  stop_time: item.stop_time || item.time_stop || "-",
  department: item.department || item.department_name || item.rider_name || "-",
  status: item.status || item.state || item.priority || "-",
  description_text: htmlToText(item.description),
});

const htmlToText = (value) => {
  if (!value) return "-";
  if (typeof document === "undefined")
    return (
      String(value)
        .replace(/<[^>]*>/g, "")
        .trim() || "-"
    );

  const container = document.createElement("div");
  container.innerHTML = String(value);
  return container.textContent?.trim() || "-";
};

const calculateDuration = (start, stop) => {
  if (!start || !stop) return "-";

  const duration = (new Date(stop) - new Date(start)) / (1000 * 60 * 60);
  return Number.isFinite(duration) ? `${duration} hr` : "-";
};

export default http;
