<script setup>
import { ref, onMounted } from 'vue'
import ResourceGrid from '../components/ResourceGrid.vue'
import { getRoomsAndCarsList } from '@/services/api/bookingApi.js'

const cars = ref([])

onMounted(async () => {
  try {
    cars.value = await getRoomsAndCarsList(2)
    console.log('[CarEventsView] cars:', cars.value)
  } catch (error) {
    console.error('[CarEventsView] failed to load cars:', error)
  }
})
</script>

<template>
  <div class="p-6">
        <h1 class="text-xl font-bold text-slate-900 mb-5">Booking Cars</h1>
        <ResourceGrid :resources="cars" type="car" />
  </div>
</template>
