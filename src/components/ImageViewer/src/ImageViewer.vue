<template>
	<ElImageViewer v-if="show" v-bind="getBindValue" @close="close" />
</template>

<script setup lang="ts">
import { ElImageViewer } from 'element-plus'
import { computed, ref, PropType } from 'vue'
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
	urlList: {
		type: Array as PropType<string[]>,
		default: (): string[] => []
	},
	zIndex: propTypes.number.def(200),
	initialIndex: propTypes.number.def(0),
	infinite: propTypes.bool.def(true),
	hideOnClickModel: propTypes.bool.def(false),
	appendToBody: propTypes.bool.def(false),
	show: propTypes.bool.def(false)
})

const getBindValue = computed(() => {
	console.log(props.show)
	const propsData: Recordable = { ...props }
	delete propsData.show
	return propsData
})

const show = ref(props.show)

const close = () => {
	console.log(show, 'show')
	show.value = false
}
</script>