<template>
  <div class="min-h-screen bg-slate-100 flex font-sans text-slate-800 overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Layout -->
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <!-- Navbar -->
      <Navbar />

      <!-- Content Area -->
      <main class="flex-1 overflow-y-auto bg-slate-50/70 p-6">
        <div class="max-w-7xl mx-auto space-y-6">
          
          <!-- ຖ້າກຳລັງໂຫຼດ -->
          <div v-if="loading" class="flex justify-center items-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          </div>

          <!-- ຖ້າເກີດ Error -->
          <div v-else-if="error" class="bg-red-50 p-4 text-red-700 rounded-lg border border-red-200 text-xs">
            {{ error }}
          </div>

          <!-- ຖ້າມີຂໍ້ມູນແລ້ວ -->
          <div v-else-if="booking" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div class="lg:col-span-2 bg-white rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs border border-slate-200/80">
              <div>
                <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">{{ booking.code || '-' }}</span>
                <h1 class="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                  {{ booking.title || '-' }}
                </h1>
              </div>

              <hr class="border-slate-100" />

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <label class="text-slate-500 font-medium block mb-1">ເລີ່ມ *</label>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-slate-700 font-medium">{{ booking.start_time || '-' }}</div>
                </div>
                <div>
                  <label class="text-slate-500 font-medium block mb-1">ຫາ *</label>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-slate-700 font-medium">{{ booking.end_time || '-' }}</div>
                </div>
                <div>
                  <label class="text-slate-500 font-medium block mb-1">ຜູ້ສ້າງ</label>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-slate-700">{{ booking.create_uid || booking.requester || '-' }}</div>
                </div>
                <div>
                  <label class="text-slate-500 font-medium block mb-1">ຈຳນວນຊົ່ວໂມງ</label>
                  <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-slate-700 font-semibold">{{ booking.duration || '-' }}</div>
                </div>
              </div>
            </div>

          </div>

          <!-- ຖ້າຫາຂໍ້ມູນບໍ່ພົບເລີຍ -->
          <div v-else class="text-center py-20 text-slate-400 bg-white rounded-2xl border border-slate-200/80">
            ບໍ່ພົບຂໍ້ມູນການຈອງລະຫັດນີ້ (ID: {{ bookingId }})
          </div>

        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/app/components/Navbar.vue'
import Sidebar from '@/app/components/Sidebar.vue'
import { useBookdetail } from '@/features/bookings/composables/useBookdetail'

const route = useRoute()
const { getBookingById, loadBookings, loading, error } = useBookdetail()

const bookingId = route.params.id

const booking = computed(() => {
  const result = getBookingById(bookingId)
  return result.value
})

onMounted(async () => {
  if (bookingId) {
    await loadBookings(bookingId)
  }
})
</script>