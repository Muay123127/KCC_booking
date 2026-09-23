<script setup>
import { ref, computed, watch } from 'vue'
import AddBookingModal from '../bookings/AddBookingModal.vue'
import { getBookingDetail } from '@/app/api/bookingApi.js'

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
const bookingDetails = ref({})
const loadingDetails = ref({})

const resourceItems = computed(() => props.resources.map((item) => ({
  ...item,
  type: props.type,
  typeLabel: props.type === 'car' ? 'Car' : 'Room',
})))

const loadBookingDetails = async (resources) => {
  const detailEntries = await Promise.all(resources.map(async (resource) => {
    if (!resource.id) return [resource.id, []]

    loadingDetails.value = { ...loadingDetails.value, [resource.id]: true }
    try {
      const details = await getBookingDetail(resource.id)
      return [resource.id, details]
    } catch (error) {
      console.error('[ResourceGrid] booking detail failed:', {
        resourceId: resource.id,
        error,
      })
      return [resource.id, []]
    } finally {
      loadingDetails.value = { ...loadingDetails.value, [resource.id]: false }
    }
  }))

  bookingDetails.value = Object.fromEntries(detailEntries)
}

watch(() => props.resources, loadBookingDetails, { immediate: true })

const bookingsFor = (item) => {
  if (loadingDetails.value[item.id]) return []

  const details = bookingDetails.value[item.id]
  if (Array.isArray(details) && details.length > 0) return details.filter(hasBookingData)

  const nestedBookings = item.bookings || item.booking_details || item.events
  if (Array.isArray(nestedBookings) && nestedBookings.length > 0) {
    return nestedBookings.filter(hasBookingData)
  }

  if (item.booking && hasBookingData(item.booking)) return [item.booking]

  return hasBookingData(item)
    ? [item]
    : []
}

const hasBookingData = (booking) => [
  booking.create_uid,
  booking.start_date,
  booking.start_time,
  booking.stop_date,
  booking.stop_time,
].some((value) => value && value !== '-')

const displayCreateUid = (booking) => {
  if (typeof booking.create_uid === 'object') {
    return booking.create_uid.name || booking.create_uid.login || booking.create_uid.id || '-'
  }
  return booking.create_uid || '-'
}

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
            :to="{ path: '/meeting-rooms', query: { roomId: item.id, roomName: item.name, type_id: item.type === 'car' ? 2 : 1 } }"
            class="bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold py-2 px-3 rounded-xl flex items-center justify-center no-underline"
          >
            History
          </router-link>
        </div>
      </div>

      <div class="p-4 flex-1 overflow-y-auto max-h-[220px] space-y-2.5 bg-white">
        <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Upcoming</p>

        <div
          v-for="(booking, index) in bookingsFor(item)"
          :key="`${item.type}-${item.id}-${index}`"
          class="p-2.5 rounded-xl bg-slate-50/80 hover:bg-blue-50/40 border border-slate-100 transition text-xs flex flex-col space-y-1"
        >
          <div class="font-bold text-rose-600 flex items-center">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500 mr-2 shrink-0"></span>
            <span class="truncate" :title="displayCreateUid(booking)">{{ displayCreateUid(booking) }}</span>
          </div>
          <div class="text-slate-500 pl-3.5 text-[11px]">
            <span>
              {{ booking.start_date }} {{ booking.start_time }}
              - {{ booking.stop_date }} {{ booking.stop_time }}
            </span>
          </div>
        </div>

        <div v-if="loadingDetails[item.id]" class="text-center py-8 text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          Loading bookings...
        </div>

        <div v-else-if="bookingsFor(item).length === 0" class="text-center py-8 text-slate-400 text-xs bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
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
