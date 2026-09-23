import { computed, ref } from 'vue'
import { fetchBookingDetail as fetchBookingDetailApi } from '../services/bookingService'

export function useBookdetail() {
  const bookings = ref([])
  const loading = ref(false)
  const error = ref(null)

  const getBookingById = (id) => {
    return computed(() => {
      return bookings.value.find((item) => String(item.id) === String(id))
    })
  }

  const normalizeList = (response) => {
    if (Array.isArray(response)) return response
    if (response && response.status === true && Array.isArray(response.data)) return response.data
    if (response && Array.isArray(response.data)) return response.data
    if (response && (response.id || response.booking_id || response.event_id)) return [response]
    if (response && Array.isArray(response.results)) return response.results
    if (response && Array.isArray(response.bookings)) return response.bookings
    if (response && Array.isArray(response.events)) return response.events
    return []
  }

  const loadBookings = async (bookingId) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetchBookingDetailApi(bookingId)
      bookings.value = normalizeList(response)
    } catch (err) {
      error.value = err?.message || 'ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ'
      console.error('Error in loadBookings:', err)
      bookings.value = []
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    loading,
    error,
    getBookingById,
    loadBookings,
  }
}