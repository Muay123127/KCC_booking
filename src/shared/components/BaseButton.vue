<script setup>
defineProps({
	type: {
		type: String,
		default: 'button',
	},
	loading: {
		type: Boolean,
		default: false,
	},
	disabled: {
		type: Boolean,
		default: false,
	},
})
</script>

<template>
	<button
		:type="type"
		:disabled="disabled || loading"
		class="inline-flex items-center justify-center gap-2 rounded-xl bg-[#243746] px-4 py-3 text-xs font-semibold text-white shadow-lg shadow-[#243746]/20 transition-all duration-200 hover:bg-[#1a2833] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
	>
		<span v-if="loading" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
		<slot />
	</button>
</template>
