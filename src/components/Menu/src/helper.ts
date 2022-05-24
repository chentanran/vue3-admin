import type { RouteMeta } from 'vue-router'
import { ref, unref } from 'vue'
import { findPath } from '@/utils/tree'

type OnlyOneChildType = AppRouteRecordRaw & { noShowingChildren?: boolean }

interface HasOneShowingChild {
	oneShowingChild?: boolean
	onlyOneChild?: OnlyOneChildType
}

export const getAllParentPath = <T = Recordable>(treeData: T[], path: string) => {
	const menuList = findPath(treeData, (n) => n.path === path) as AppRouteRecordRaw[]
	return (menuList || []).map(item => item.path)
}

export const hasOneShowingChild = (
	children: AppRouteRecordRaw[] = [],
	parent: AppRouteRecordRaw
): HasOneShowingChild => {
	const onlyOneChild = ref<OnlyOneChildType>()

	const showingChildren = children.filter(v => {
		const meta = (v.meta ?? {}) as RouteMeta
		if (meta.hidden) {
			return false
		} else {
			onlyOneChild.value = v
			return true
		}
	})

	if (showingChildren.length === 1) {
		return {
			oneShowingChild: true,
			onlyOneChild: unref(onlyOneChild)
		}
	}

	if (!showingChildren.length) {
		onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
		return {
			oneShowingChild: true,
			onlyOneChild: unref(onlyOneChild)
		}
	}

	return {
		oneShowingChild: false,
		onlyOneChild: unref(onlyOneChild)
	}
}