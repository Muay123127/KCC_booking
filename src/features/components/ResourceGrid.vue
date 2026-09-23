<script setup>
import { ref, computed } from 'vue'
import AddBookingModal from '../bookings/AddBookingModal.vue'

const props = defineProps({
  resources: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'room',
  },
})

const isModalOpen = ref(false)
const currentResource = ref(null)

const resourceItems = computed(() => props.resources.map((item) => ({
  ...item,
  type: props.type,
  typeLabel: props.type === 'car' ? 'Car' : 'Room',
})))

const openBookingModal = (resource) => {
  currentResource.value = resource
  isModalOpen.value = true
}

const closeBookingModal = () => {
  isModalOpen.value = false
  currentResource.value = null
}

const handleSaveBooking = (bookingData) => {
  console.log('Successfully saved booking data:', bookingData)
  closeBookingModal()
}
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pb-6">
    <div
      v-for="item in resourceItems"
      :key="`${item.type}-${item.id}`"
      class="bg-white rounded-2xl shadow-xs hover:shadow-xl border border-slate-200/80 flex flex-col overflow-hidden transition-all duration-300 group"
    >
      <div class="bg-gradient-to-br from-slate-50 to-slate-100/50 p-5 border-b border-slate-100 flex flex-col">
        <div class="flex items-center justify-between gap-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-100">{{ item.typeLabel }}</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium" :class="item.state === 'available' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'">
            {{ item.state === 'available' ? 'Available' : item.state }}
          </span>
        </div>

        <h3 class="mt-3 font-bold text-slate-800 text-base group-hover:text-blue-600 transition-colors line-clamp-1" :title="item.name">
          {{ item.name }}
        </h3>

        <div class="mt-2 text-xs text-slate-500">
          Capacity: <strong class="text-slate-700">{{ item.capacity || '-' }}</strong>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-4">
          <button
            @click="openBookingModal(item)"
            class="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-xl transition shadow-sm shadow-blue-600/20 cursor-pointer"
          >
            Book
          </button>

          <router-link
            :to="item.type === 'car' ? { path: '/booking-cars', query: { roomId: item.id, roomName: item.name, type_id: 2 } } : { path: '/booking-rooms', query: { roomId: item.id, roomName: item.name, type_id: 1 } }"
            class="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center no-underline"
          >
            History
          </router-link>
        </div>
      </div>

      <div class="p-4 flex-1 overflow-y-auto max-h-[220px] space-y-2.5 bg-white">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Upcoming</p>

        <div
          v-for="(booking, index) in item.bookings || []"
          :key="`${item.type}-${item.id}-${index}`"
          class="p-2.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-100 transition text-xs flex flex-col space-y-1"
        >
          <div class="font-bold text-rose-600 flex items-center">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 shrink-0"></span>
            <span class="truncate" :title="booking.code">{{ booking.code }}</span>
          </div>
          <div class="text-slate-500 pl-3.5 text-[11px]">
            <span>{{ booking.time }}</span>
          </div>
        </div>

        <div v-if="!item.bookings || item.bookings.length === 0" class="text-center py-8 text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          No booking yet
        </div>
      </div>
    </div>
  </div>

  <AddBookingModal
    v-if="isModalOpen"
    :room="currentResource"
    @close="closeBookingModal"
    @save="handleSaveBooking"
  />
</template>
