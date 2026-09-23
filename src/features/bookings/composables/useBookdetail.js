import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/app/components/Navbar.vue'
import Sidebar from '@/app/components/Sidebar.vue'
import { fetchBookings as fetchBookingsApi, saveBooking } from '../services/bookdetailService'

export function useBookdetail() {
  const bookings = ref([])
  const loading = ref(false)
  const error = ref(null)

 // ຄົ້ນຫາຂໍ້ມູນການຈອງຕາມ ID (ປ້ອງກັນปัญหา String / Number)
  const getBookingById = (id) => {
    return computed(() => {
      return bookings.value.find((item) => String(item.id) === String(id))
    })
  }

  // ດຶງຂໍ້ມູນການຈອງຜ່ານ Service
  const loadBookings = async (bookingId) => {
    loading.value = true
    error.value = null
    try {
      const response = await fetchBookingsApi(bookingId)
      
      if (response && response.status === true && Array.isArray(response.data)) {
        bookings.value = response.data
      } else if (Array.isArray(response)) {
        bookings.value = response
      } else {
        bookings.value = response?.data || []
      }
    } catch (err) {
      error.value = err.message || 'ເກີດຂໍ້ຜິດພາດໃນການໂຫຼດຂໍ້ມູນ'
      console.error('Error in loadBookings:', err)
    } finally {
      loading.value = false
    }
  }

  // ບັນທຶກຂໍ້ມູນການຈອງໃໝ່
  const createBooking = async (payload) => {
    loading.value = true
    error.value = null
    try {
      const result = await saveBooking(payload)
      return result
    } catch (err) {
      error.value = err.message || 'ເກີດຂໍ້ຜິດພາດໃນການບັນທຶກຂໍ້ມູນ'
      throw err
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
    createBooking
  }
}