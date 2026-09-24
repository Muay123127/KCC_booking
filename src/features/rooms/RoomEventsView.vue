<script setup>
import { ref, onMounted } from 'vue'
import ResourceGrid from '../components/ResourceGrid.vue'
import { getRoomsAndCarsList } from '@/services/api/bookingApi.js'
import Navbar from '@/shared/components/Navbar.vue'
import Sidebar from '@/shared/components/Sidebar.vue'

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
  <div class="min-h-screen bg-slate-100 flex font-sans text-slate-800 overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col h-screen overflow-hidden">
      <Navbar />
      <main class="flex-1 overflow-y-auto bg-slate-50 p-6">
        <h1 class="text-xl font-bold text-slate-900 mb-5">Booking Rooms</h1>
        <ResourceGrid :resources="rooms" type="room" />
      </main>
    </div>
  </div>
</template>
