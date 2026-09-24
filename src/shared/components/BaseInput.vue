<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
	modelValue: {
		type: [String, Number],
		default: '',
	},
	label: {
		type: String,
		default: '',
	},
	id: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		default: 'text',
	},
})

defineEmits(['update:modelValue'])
</script>

<template>
	<label :for="id" class="block">
		<span v-if="label" class="block text-xs font-semibold text-slate-700 mb-1.5">
			{{ label }}
		</span>
		<span class="relative block">
			<span v-if="$slots.prefix" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
				<slot name="prefix" />
			</span>
			<input
				:id="id"
				:type="type"
				:value="modelValue"
				v-bind="$attrs"
				class="w-full py-2.5 text-xs bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#243746]/20 focus:border-[#243746] transition placeholder:text-slate-400 text-slate-800"
				:class="[$slots.prefix ? 'pl-9' : 'pl-3', $slots.suffix ? 'pr-10' : 'pr-3']"
				@input="$emit('update:modelValue', $event.target.value)"
			/>
			<span v-if="$slots.suffix" class="absolute inset-y-0 right-0 pr-3 flex items-center">
				<slot name="suffix" />
			</span>
		</span>
	</label>
</template>
