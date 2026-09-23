import axios from 'axios'

// ใช้ Vite proxy เพื่อหลีกเลี่ยง CORS ในช่วง dev
const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json'
  }
})

// 🛡️ แนบ Token อัตโนมัติทุกครั้งที่มีการ Request (ถ้ามีเก็บไว้ใน localStorage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('user-token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export const getMeetingRooms = async () => {
  try {
    const response = await api.get('/api/bookings?type_id=1')
    if (response.data?.status === false) {
      throw new Error(response.data.message || 'Unable to load meeting rooms')
    }

    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.results || response.data?.data || response.data?.bookings || []

    return data.map(item => ({
      id: item.id || item.room_id,
      name: item.name || item.room_name || 'ບໍ່ລະບຸຊື່ຫ້ອງ',
      capacity: item.capacity,
      state: item.state || 'unavailable',
      typeName: item.type_name || item.type?.name || '',
      bookings: Array.isArray(item.bookings)
        ? item.bookings
        : Array.isArray(item.reservations) ? item.reservations : []
    }))
  } catch (error) {
    console.error('API Fetch Error (getMeetingRooms):', error)
    throw error
  }
}

export default api