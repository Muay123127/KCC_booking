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
	variant: {
		type: String,
		default: 'primary',
		validator: (value) => ['primary', 'secondary'].includes(value),
	},
})
</script>

<template>
	<button
		:type="type"
		:disabled="disabled || loading"
		class="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
		:class="variant === 'primary'
			? 'bg-[#243746] text-white shadow-lg shadow-[#243746]/20 hover:bg-[#1a2833]'
			: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'"
	>
		<span v-if="loading" class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
		<slot />
	</button>
</template>
