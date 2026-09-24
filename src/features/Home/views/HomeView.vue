<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '@/shared/components/Navbar.vue'
import Sidebar from '@/shared/components/Sidebar.vue'
import { getRoomsAndCarsList } from '@/services/api/bookingApi.js'

const rooms = ref([])
const cars = ref([])
const loading = ref(true)
const errorMessage = ref('')
const searchQuery = ref('')
const userName = ref(localStorage.getItem('username') || '')

const fetchDashboardData = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const [roomList, carList] = await Promise.all([
      getRoomsAndCarsList(1),
      getRoomsAndCarsList(2),
    ])

    rooms.value = roomList
    cars.value = carList
  } catch (error) {
    console.error('Dashboard Fetch Error:', error)
    errorMessage.value = 'ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ API ໄດ້, ກະລຸນາກວດສອບການເຊື່ອມຕໍ່'

    rooms.value = [
      {
        id: 1,
        name: 'ຫ້ອງປະຊຸມໃຫຍ່ (Grand) ຊັ້ນ 1',
        capacity: '24',
        state: 'available',
        bookings: [
          { code: 'BK00214-ນ.ວັນສິນ ມິສະສີ', time: '14-09-2026 08:00 - 15-09-2026 12:00' },
          { code: 'BK00128-ນ.ຕາວອນ ປານະວົງ', time: '15-09-2025 14:00 - 17:00' }
        ]
      }
    ]

    cars.value = [
      {
        id: 101,
        name: 'รถตู้ 9 ที่นั่ง',
        capacity: '9',
        state: 'available',
        bookings: [{ code: 'CR001-ມອງພິມ', time: '20-09-2026 09:00 - 12:00' }]
      }
    ]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDashboardData()
})

const handleSearch = (keyword) => {
  searchQuery.value = keyword
}

const resourceList = computed(() => {
  const roomItems = rooms.value.map((item) => ({ ...item, type: 'room', typeLabel: 'Room' }))
  const carItems = cars.value.map((item) => ({ ...item, type: 'car', typeLabel: 'Car' }))
  return [...roomItems, ...carItems]
})

const totalBookings = computed(() =>
  resourceList.value.reduce((total, item) => total + (item.bookings?.length || 0), 0),
)
const availableRooms = computed(() => rooms.value.filter((item) => item.state === 'available').length)
const availableCars = computed(() => cars.value.filter((item) => item.state === 'available').length)
const totalResources = computed(() => resourceList.value.length)

</script>

<template>
  <div class="min-h-screen bg-slate-100 flex font-sans text-slate-800 overflow-hidden relative">
    <Sidebar />

    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <Navbar @search="handleSearch" />

      <main class="flex-1 overflow-y-auto bg-slate-50 p-8">
        <div class="max-w-7xl mx-auto space-y-6">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-xs font-medium text-blue-600 uppercase tracking-wider">Dashboard</p>
              <h1 class="text-2xl font-bold text-slate-900">Welcome, {{ userName || 'User' }}</h1>
            </div>
            <div class="text-xs text-slate-500 bg-white px-3 py-2 rounded-xl border border-slate-200">
              Total: <strong class="text-slate-800">{{ totalResources }}</strong> Assets
            </div>
          </div>

          <div v-if="errorMessage" class="mb-6 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
            <span>⚠️ {{ errorMessage }}</span>
            <button @click="fetchDashboardData" class="underline font-bold cursor-pointer">Retry</button>
          </div>

          <div v-if="loading" class="flex items-center justify-center py-24">
            <div class="flex flex-col items-center space-y-3">
              <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-xs text-slate-500 font-medium">Loading dashboard...</p>
            </div>
          </div>

          <div v-else class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div class="text-xs text-slate-500 uppercase tracking-wider">Rooms</div>
                <div class="mt-3 text-3xl font-bold text-slate-900">{{ rooms.length }}</div>
                <div class="mt-1 text-xs text-emerald-600">{{ availableRooms }} available</div>
              </div>

              <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div class="text-xs text-slate-500 uppercase tracking-wider">Cars</div>
                <div class="mt-3 text-3xl font-bold text-slate-900">{{ cars.length }}</div>
                <div class="mt-1 text-xs text-emerald-600">{{ availableCars }} available</div>
              </div>

              <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div class="text-xs text-slate-500 uppercase tracking-wider">Bookings</div>
                <div class="mt-3 text-3xl font-bold text-slate-900">{{ totalBookings }}</div>
                <div class="mt-1 text-xs text-blue-600">Current records</div>
              </div>

              <div class="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                <div class="text-xs text-slate-500 uppercase tracking-wider">Quick Access</div>
                <div class="mt-3 flex gap-2">
                  <router-link :to="{ path: '/', query: { type_id: 1 } }" class="flex-1 bg-blue-600 text-white text-xs font-semibold py-2.5 rounded-xl text-center">Rooms</router-link>
                  <router-link :to="{ path: '/booking-cars', query: { type_id: 2 } }" class="flex-1 bg-slate-800 text-white text-xs font-semibold py-2.5 rounded-xl text-center">Cars</router-link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>

  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
