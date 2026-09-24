<script setup>
import { ref, onMounted } from 'vue'
import ResourceGrid from '../components/ResourceGrid.vue'
import { getRoomsAndCarsList } from '@/services/api/bookingApi.js'

const rooms = ref([])

onMounted(async () => {
  try {
    rooms.value = await getRoomsAndCarsList(1)
    console.log('[RoomEventsView] rooms:', rooms.value)
  } catch (error) {
    console.error('[RoomEventsView] failed to load rooms:', error)
  }
})
</script>

<template>
  <div class="p-6">
        <h1 class="text-xl font-bold text-slate-900 mb-5">Booking Rooms</h1>
        <ResourceGrid :resources="rooms" type="room" />
  </div>
</template>
