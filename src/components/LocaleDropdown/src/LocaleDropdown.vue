<template>
	<ElDropdown :class="prefixCls" trigger="click" @command="setLang">
    <Icon
      :size="18"
      icon="ion:language-sharp"
      class="cursor-pointer"
      :class="$attrs.class"
      :color="color"
    />
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem v-for="item in langMap" :key="item.lang" :command="item.lang">
          {{ item.name }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script lang="ts" setup>
import { computed, unref } from 'vue'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import { useLocaleStore } from '@/store/modules/locale'
import { useLocale } from '@/hooks/web/useLocale'
import { propTypes } from '@/utils/propTypes'
import { useDesign } from '@/hooks/web/useDesign'

const { getPrefixCls } = useDesign()

const prefixCls = getPrefixCls('locale-dropdown')

defineProps({
	color: propTypes.string.def('')
})

const localStore = useLocaleStore()

const langMap = computed(() => localStore.getLocaleMap)

const currentLang = computed(() => localStore.getCurrentLocale)

const setLang = (lang: LocaleType) => {
	if (lang === unref(currentLang).lang) return
	// 重新加载页面让整个语言初始化
	window.location.reload()
	localStore.setCurrentLocale({
		lang
	})
	const { changeLocale } = useLocale()
	changeLocale(lang)
}
</script>

<style>

</style>