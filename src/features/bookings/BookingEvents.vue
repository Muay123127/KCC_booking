<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/app/components/Navbar.vue'
import Sidebar from '@/app/components/Sidebar.vue'
import { getMeetingBookings, getBookingEvents } from '@/app/api/bookingApi'

const route = useRoute()
const selectedRoomId = ref(null)
const selectedRoomName = ref('')

// สถานะการโหลดและเก็บข้อมูล
const loading = ref(false)
const errorMessage = ref('')
const bookingsList = ref([])
const searchQuery = ref('')

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

// ฟังก์ชันดึงค่าข้อมูลตาม Key ของคอลัมน์เสริม (พร้อมระบบ Debug ดูค่าที่ได้จาก API ผ่าน Console)
const getColumnValue = (item, key) => {
  // บรรทัดนี้จะช่วยแสดงโครงสร้างข้อมูลทั้งหมดของแต่ละแถวใน F12 -> Console
  console.log(`Checking key [${key}] for item:`, item)

  switch (key) {
    case 'purpose': 
      return item.purpose || item.description_text || item.description || item.reason || item.note || '-'
    case 'creator': 
      return item.creator || item.requester || item.user_name || item.created_by || item.user || '-'
    case 'creator_dept': 
      return item.creator_dept || item.department || item.creator_department || item.dept || '-'
    case 'created_for': 
      return item.created_for || item.for_user || item.target_user || '-'
    case 'division': 
      return item.division || item.div || '-'
    case 'unit': 
      return item.unit || item.section || '-'
    case 'emp_code': 
      return item.emp_code || item.employee_code || item.staff_id || item.employee_id || '-'
    case 'user_dept': 
      return item.user_dept || item.department || item.user_department || '-'
    case 'food_drink': 
      return item.food_drink || item.has_food || item.food || item.is_food || '-'
    case 'created_date': 
      return item.created_date || item.created_at || item.date || item.timestamp || '-'
    default: 
      return item[key] || '-'
  }
}

// ดึงข้อมูลจาก API จริง
const fetchBookingsData = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    let data = []
    if (selectedRoomId.value) {
      data = await getBookingEvents(selectedRoomId.value)
    } else {
      data = await getMeetingBookings()
    }
    bookingsList.value = data
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    errorMessage.value = 'ไม่สามารถโหลดข้อมูลการจองได้ กรุณาลองใหม่อีกครั้ง'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
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

const handleSearch = (keyword) => {
  searchQuery.value = keyword
  currentPage.value = 1
}

const handleNewBooking = () => {
  alert('ເປີດຟອມສ້າງການຈອງຫ້ອງປະຊຸມໃໝ່')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex font-sans text-slate-800 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Layout -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Navbar -->
      <Navbar @search="handleSearch" />

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto bg-slate-50/70 p-6">
        
        <!-- Top Action Bar -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white p-4 rounded-2xl shadow-xs border border-slate-200/80">
          <div class="flex items-center space-x-3">
            <div class="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h1 class="text-base font-bold text-slate-800">Meeting Room Bookings</h1>
              <p class="text-xs text-slate-500">
                <span v-if="selectedRoomName">ກຳລັງສະແດງປະຫວັດຂອງ: <strong class="text-blue-600">{{ selectedRoomName }}</strong></span>
                <span v-else>ຈັດການ ແລະ ตรวจสอบรายการจองห้องประชุมทั้งหมดภายในระบบ</span>
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
            </div>
            
            <!-- ตัวเลือกจำนวนรายการที่จะแสดงต่อหน้า -->
            <div class="flex items-center space-x-2 text-xs text-slate-600">
              <span>ສະແດງ</span>
              <select 
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
                    <input type="checkbox" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
                  </th>
                  <th class="py-3 px-4">ເລກການຈອງ</th>
                  <th class="py-3 px-4">ຊື່</th>
                  <th class="py-3 px-4">ເລີ່ມ</th>
                  <th class="py-3 px-4">ສິ້ນສຸດ</th>
                  <th class="py-3 px-4">ລວມເປັນຊົ່ວໂມງ</th>

                  <!-- คอลัมน์เสริมที่จะแสดงผลเมื่อถูกติ๊กเลือก Checkbox -->
                  <th 
                    v-for="col in optionalColumns.filter(c => c.visible)" 
                    :key="col.key" 
                    class="py-3 px-4 whitespace-nowrap"
                  >
                    {{ col.label }}
                  </th>
                  
                  <!-- ปุ่มเปิดกล่องเลือกคอลัมน์ด้านขวา (ล็อกขนาดความกว้างเพื่อไม่ให้ขยับ) -->
                  <th class="py-3 px-4 text-center relative column-settings-container w-12 whitespace-nowrap">
                    <button 
                      @click.stop="toggleColumnDropdown"
                      class="p-1 hover:bg-slate-200 rounded text-slate-500 transition cursor-pointer inline-block" 
                      title="ປັບແຕ່ງຄໍລໍ້າ"
                    >
                      <svg class="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                      </svg>
                    </button>

                    <!-- Dropdown Box ทางขวาสำหรับเลือกหัวข้อเพิ่มเติม -->
                    <div 
                      v-if="showColumnDropdown" 
                      class="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg z-50 p-2 text-left"
                    >
                      <div class="max-h-60 overflow-y-auto space-y-1">
                        <label 
                          v-for="col in optionalColumns" 
                          :key="col.key" 
                          class="flex items-center space-x-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-700"
                        >
                          <input 
                            type="checkbox" 
                            v-model="col.visible" 
                            class="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          >
                          <span class="truncate">{{ col.label }}</span>
                        </label>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr 
                  v-for="item in paginatedBookings" 
                  :key="item.id" 
                  class="hover:bg-blue-50/40 transition-colors"
                >
                  <td class="py-3.5 px-4 w-10">
                    <input type="checkbox" class="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer">
                  </td>
                  <td class="py-3.5 px-4 font-bold text-blue-600 whitespace-nowrap">{{ item.code || item.id }}</td>
                  <td class="py-3.5 px-4 font-medium text-slate-800 max-w-xs truncate" :title="item.title">
                    {{ item.title }}
                  </td>
                  <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">{{ item.start_time }}</td>
                  <td class="py-3.5 px-4 text-slate-600 whitespace-nowrap">{{ item.end_time }}</td>
                  <td class="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">{{ item.duration }}</td>

                  <!-- ข้อมูลในคอลัมน์เสริมที่ถูกเลือกแสดง -->
                  <td 
                    v-for="col in optionalColumns.filter(c => c.visible)" 
                    :key="col.key" 
                    class="py-3.5 px-4 text-slate-700 whitespace-nowrap"
                  >
                    {{ getColumnValue(item, col.key) }}
                  </td>

                  <td></td>
                </tr>

                <!-- Empty State -->
                <tr v-if="filteredBookings.length === 0">
                  <td :colspan="6 + optionalColumns.filter(c => c.visible).length + 1" class="text-center py-12 text-slate-400">
                    ບໍ່ພົບຂໍ້ມູນການຈອງຫ້ອງປະຊຸມໃນຂະນະນີ້
                  </td>
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

      </main>
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