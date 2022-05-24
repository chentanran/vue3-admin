<template>
	<div>{{ readersNumber }}</div>
</template>

<script lang="js">
import { watch } from 'fs'
import { defineComponent, ref } from 'vue'
import { tool } frrom 'tool'


export default defineComponent({
		setup() {
			const readersNumber = ref(0)
			const a = tool()
			watch(
				readersNumber,
				(readersNumber) => {} 
			)

			onMounted(() => {
				
			}),

			onUnmounted(() => {
				
			}),

			return {
				readersNumber
			}
 		},
		data () {
			return {
				readersNumber: 0,
				a: 1
			}
		},
		created() {

		},
		mounted() {
			a = tool()
		},
		watch: {

		}
})
 

</script>

<style>

</style>