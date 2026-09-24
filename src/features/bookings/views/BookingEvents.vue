<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import { useRoute } from 'vue-router'
import { getRoomsAndCarsList, getBookingDetail } from '@/services/api/bookingApi.js'

const props = defineProps({
  typeId: {
    type: Number,
    default: null,
  },
  entityLabel: {
    type: String,
    default: 'Meeting Room',
  },
})

const route = useRoute()
const selectedTypeId = ref(Number(route.query.type_id ?? props.typeId ?? 1))
const selectedRoomId = ref(null)
const selectedRoomName = ref('')

// สถานะการโหลดและเก็บข้อมูล
const loading = ref(false)
const errorMessage = ref('')
const bookingsList = ref([])
const searchQuery = inject('layoutSearch', ref(''))

// เก็บรายการ ID ของแถวที่ถูกเลือก (Selected Rows)
const selectedItems = ref([])

// สถานะการเปิด-ปิด Dropdown ตั้งค่าคอลัมน์
const showColumnDropdown = ref(false)

// รายการคอลัมน์เสริม (ตั้งค่าเริ่มต้นเป็น false ทั้งหมด)
const optionalColumns = ref([
  { key: 'purpose', label: 'ຈຸດປະສົງ', visible: false },
  { key: 'creator', label: 'ຜູ້ສ້າງ', visible: false },
  { key: 'creator_dept', label: 'ພະແນກຜູ້ສ້າງ', visible: false },
  { key: 'created_for', label: 'ສ້າງໃຫ້', visible: false },
  { key: 'division', label: 'ຝ່າຍ', visible: false },
  { key: 'unit', label: 'ໜ່ວຍງານ', visible: false },
  { key: 'emp_code', label: 'ລະຫັດພະນັກງານ', visible: false },
  { key: 'user_dept', label: 'ພະແນກຜູ້ໃຊ້', visible: false },
  { key: 'food_drink', label: 'ເອົາອາຫານແລະນ้ำດື່ມ', visible: false },
  { key: 'created_date', label: 'ວັນທີສ້າງ', visible: false }
])

const toggleColumnDropdown = () => {
  showColumnDropdown.value = !showColumnDropdown.value
}

// ปิด Dropdown เมื่อคลิกพื้นที่อื่น
const closeDropdown = (e) => {
  if (!e.target.closest('.column-settings-container')) {
    showColumnDropdown.value = false
  }
}

// ดึงข้อมูลจาก API จริง
const fetchBookingsData = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    let data = []
    if (selectedRoomId.value) {
      data = await getBookingDetail(selectedRoomId.value)
    } else {
      data = await getRoomsAndCarsList(selectedTypeId.value)
    }
    bookingsList.value = data
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง'
  } finally {
    loading.value = false
  }
}

const pageTitle = computed(() => {
  return selectedTypeId.value === 2 ? 'Car Bookings' : 'Meeting Room Bookings'
})

onMounted(() => {
  const typeFromQuery = Number(route.query.type_id)
  if (!Number.isNaN(typeFromQuery) && typeFromQuery > 0) {
    selectedTypeId.value = typeFromQuery
  }

  if (props.typeId) {
    selectedTypeId.value = Number(props.typeId)
  }

  if (route.query.roomId) {
    selectedRoomId.value = route.query.roomId
  }
  if (route.query.roomName) {
    selectedRoomName.value = route.query.roomName
  }
  fetchBookingsData()
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

// ระบบกรองข้อมูลตามช่องค้นหา (Search)
const filteredBookings = computed(() => {
  if (!searchQuery.value) return bookingsList.value
  const query = searchQuery.value.toLowerCase()
  return bookingsList.value.filter(item => {
    return (
      String(item.title).toLowerCase().includes(query) ||
      String(item.code).toLowerCase().includes(query) ||
      String(item.requester).toLowerCase().includes(query)
    )
  })
})

// ระบบแบ่งหน้า (Pagination) และตัวเลือกจำนวนรายการต่อหน้า
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => {
  return Math.ceil(filteredBookings.value.length / itemsPerPage.value) || 1
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredBookings.value.slice(start, end)
})

// Computed สำหรับควบคุมสถานะ Select All ในหน้าปัจจุบัน
const isAllSelected = computed(() => {
  if (paginatedBookings.value.length === 0) return false
  return paginatedBookings.value.every(item => selectedItems.value.includes(item.id))
})

const isIndeterminate = computed(() => {
  if (paginatedBookings.value.length === 0) return false
  const someSelected = paginatedBookings.value.some(item => selectedItems.value.includes(item.id))
  return someSelected && !isAllSelected.value
})

// ฟังก์ชันสลับการเลือกทั้งหมดในหน้าปัจจุบัน
const toggleSelectAll = (e) => {
  const checked = e.target.checked
  const pageIds = paginatedBookings.value.map(item => item.id)
  
  if (checked) {
    // เพิ่ม ID ของหน้าปัจจุบันเข้าไป (ไม่ให้ซ้ำกัน)
    const uniqueSet = new Set([...selectedItems.value, ...pageIds])
    selectedItems.value = Array.from(uniqueSet)
  } else {
    // เอา ID ของหน้าปัจจุบันออก
    selectedItems.value = selectedItems.value.filter(id => !pageIds.includes(id))
  }
}

const handleItemsPerPageChange = () => {
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handleNewBooking = () => {
  alert('ເປີດຟອມສ້າງການຈອງຫ້ອງປະຊຸມໃໝ່')
}
</script>

<template>
  <div class="bg-slate-50/70 p-6">
        
        <!-- Top Action Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
          <div class="flex items-center space-x-3">
            <div class="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-base font-bold text-slate-800">{{ pageTitle }}</h1>
              <p class="text-xs text-slate-500">
                <span v-if="selectedRoomName">ກຳລັງສະແດງປະຫວັດຂອງ: <strong class="text-blue-600">{{ selectedRoomName }}</strong></span>
                <span v-else>
                  {{ selectedTypeId === 2 ? 'ຈັດການ ແລະ ตรวจสอบรายการจองรถทั้งหมดภายในระบบ' : 'ຈັດການ ແລະ ตรวจสอบรายการจองห้องประชุมทั้งหมดภายในระบบ' }}
                </span>
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <button 
              @click="handleNewBooking"
              class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm shadow-blue-600/20 flex items-center space-x-2 transition cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              <span>New Booking</span>
            </button>
          </div>
        </div>

        <!-- Notification Banner ถ้าเชื่อม API ไม่ผ่าน -->
        <div v-if="errorMessage" class="mb-4 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-xl text-xs flex items-center justify-between">
          <span>⚠️ {{ errorMessage }}</span>
          <button @click="fetchBookingsData" class="underline font-bold cursor-pointer">ລອງໃໝ່</button>
        </div>

        <!-- Table Container -->
        <div class="bg-white rounded-2xl shadow-xs border border-slate-200/80 overflow-hidden flex flex-col">
          
          <!-- Table Header Stats & Select Items Per Page -->
          <div class="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50/50">
            <div class="text-xs font-medium text-slate-500">
              รายการทั้งหมด: <strong class="text-slate-800">{{ filteredBookings.length }}</strong> รายการ 
              <span v-if="selectedItems.length > 0" class="ml-2 text-blue-600 font-semibold">({| selectedItems.length |} selected)</span>
            </div>
            
            <!-- ตัวเลือกจำนวนรายการที่จะแสดงต่อหน้า -->
            <div class="flex items-center space-x-2 text-xs text-slate-600">
              <span>ສະແດງ</span>
              <select 
                id="items-per-page"
                name="items-per-page"
                v-model.number="itemsPerPage" 
                @change="handleItemsPerPageChange"
                class="bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option :value="10">10</option>
                <option :value="20">20</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <span>ລາຍການ</span>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-20">
            <div class="flex flex-col items-center space-y-3">
              <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p class="text-xs text-slate-500 font-medium">กำลังโหลดข้อมูลการจอง...</p>
            </div>
          </div>

          <!-- Data Table พร้อม Scroll bar ด้านล่าง -->
          <div v-else class="overflow-x-auto relative">
            <table class="w-full text-left border-collapse text-xs min-w-max">
              <thead>
                <tr class="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                  <th class="py-3 px-4 w-10">
                    <!-- Checkbox เลือกทั้งหมด (Select All) -->
                    <input 
                      id="select-all-bookings"
                      name="select-all-bookings"
                      type="checkbox" 
                      :checked="isAllSelected"
                      :indeterminate="isIndeterminate"
                      @change="toggleSelectAll"
                      class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    >
                  </th>
                  <th class="py-3 px-4">ເລກການຈອງ</th>
                  <th class="py-3 px-4">ຊື່</th>
                  <th class="py-3 px-4">ເລີ່ມ</th>
                  <th class="py-3 px-4">ສິ້ນສຸດ</th>
                  <th class="py-3 px-4">ລວມເປັນຊົ່ວໂມງ</th>
                </tr>
              </thead>
          <tbody class="divide-y divide-slate-100">
  <!-- ให้นำโค้ດ `tr` ທີ່ກຽມໄວ້ມາแทนที่ບ່ອນນີ້ -->
  <tr 
    v-for="item in paginatedBookings" 
    :key="item.id" 
    @click="$router.push({ name: 'BookingViewDetail', params: { id: item.id } })"
    class="hover:bg-blue-50/40 transition-colors cursor-pointer"
  >
    <td class="py-3.5 px-4 w-10" @click.stop>
      <input 
        :id="`booking-${item.id}`"
        name="booking-selection"
        type="checkbox" 
        :value="item.id" 
        v-model="selectedItems"
        class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      >
    </td>
    <td class="py-3.5 px-4 font-bold text-blue-600 whitespace-nowrap">{{ item.id }}</td>
    <td class="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate" :title="item.title">
      {{ item.title }}
    </td>
    <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">{{ item.start_time }}</td>
    <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">{{ item.end_time }}</td>
    <td class="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">{{ item.duration }}</td>
  </tr>
</tbody>
            </table>
          </div>

          <!-- Table Footer Pagination Info -->
          <div class="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>
              ສະແດງ {{ filteredBookings.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0 }} - {{ Math.min(currentPage * itemsPerPage, filteredBookings.length) }} ຈາກທັງໝົດ {{ filteredBookings.length }} ລາຍການ
            </span>
            <div class="flex items-center space-x-1">
              <button 
                @click="prevPage" 
                :disabled="currentPage === 1"
                class="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
              >
                ກ່ອນໜ້າ
              </button>
              <button 
                @click="nextPage" 
                :disabled="currentPage >= totalPages"
                class="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 cursor-pointer"
              >
                ຖັດໄປ
              </button>
            </div>
          </div>

        </div>

  </div>
</template>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 8px;
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