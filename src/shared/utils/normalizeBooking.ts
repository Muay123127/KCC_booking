import type { NormalizedBooking, RawBooking } from '@/shared/types/booking'

export const normalizeBooking = (item: RawBooking): NormalizedBooking => ({
  ...item,
  bookings: Array.isArray(item.bookings)
    ? item.bookings.map(normalizeBooking)
    : item.bookings,
  id: item.id || item.booking_id || item.event_id,
  code: item.code || item.booking_code || item.reference || item.booking_id || '-',
  title: item.title || item.meeting_title || item.name || '-',
  room:
    item.room ||
    item.room_name ||
    item.item_name ||
    item.item?.name ||
    item.booking_name ||
    '-',
  start_time: item.start_time || item.time_start || item.start || '-',
  end_time: item.end_time || item.stop_date || item.date_end || item.stop || '-',
  duration: item.duration || item.hours || calculateDuration(item.start, item.stop),
  requester:
    item.requester ||
    item.username ||
    item.user_name ||
    item.created_by ||
    item.driver_name ||
    '-',
  create_uid: item.create_uid || '-',
  start_date: item.start_date || '-',
  stop_date: item.stop_date || item.start_date || '-',
  stop_time: item.stop_time || item.time_stop || '-',
  department: item.department || item.department_name || item.rider_name || '-',
  status: item.status || item.state || item.priority || '-',
  description_text: htmlToText(item.description),
})

const htmlToText = (value: unknown) => {
  if (!value) return '-'
  if (typeof document === 'undefined') {
    return String(value).replace(/<[^>]*>/g, '').trim() || '-'
  }

  const container = document.createElement('div')
  container.innerHTML = String(value)
  return container.textContent?.trim() || '-'
}

const calculateDuration = (start: unknown, stop: unknown) => {
  if (!start || !stop) return '-'

  const duration = (new Date(String(stop)).getTime() - new Date(String(start)).getTime()) / (1000 * 60 * 60)
  return Number.isFinite(duration) ? `${duration} hr` : '-'
}
