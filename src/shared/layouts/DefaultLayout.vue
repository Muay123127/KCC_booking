<script setup>
import { provide, ref } from 'vue'
import Navbar from '@/shared/components/Navbar.vue'
import Sidebar from '@/shared/components/Sidebar.vue'

const searchQuery = ref('')
provide('layoutSearch', searchQuery)
</script>

<template>
	<div class="min-h-screen bg-slate-100 flex font-sans text-slate-800 overflow-hidden">
		<Sidebar />
		<div class="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
			<Navbar @search="searchQuery = $event" />
			<main class="flex-1 overflow-y-auto bg-slate-50">
				<slot />
			</main>
		</div>
	</div>
</template>
