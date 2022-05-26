/**
 * @param str 需要转驼峰的下划线字符串
 * @returns 字符串驼峰
 */
export const underlineToHump = (str: string): string => {
	return str.replace(/\-(\w)/g, (_, letter: string) => {
		return letter.toUpperCase()
	})
}

/**
 * 查找数组对象的某个下标
 * @param {Array} ary 查找的数组
 * @param {Functon} fn 判断的方法
 */
export const findIndex = <T = Recordable>(ary: Array<T>, fn: Fn): number => {
  if (ary.findIndex) {
    return ary.findIndex(fn)
  }
  let index = -1
  ary.some((item: T, i: number, ary: Array<T>) => {
    const ret: T = fn(item, i, ary)
    if (ret) {
      index = i
      return ret
    }
  })
  return index
}

export const setCssVar = (prop: string, val: any, dom = document.documentElement) => {
  dom.style.setProperty(prop, val)
}

export const trim = (str: string) => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

/**
 * @param str 需要转下划线的驼峰字符串
 * @returns 字符串下划线
 */
 export const humpToUnderline = (str: string): string => {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 生成随机字符串
 */
 export function toAnyString() {
  const str: string = 'xxxxx-xxxxx-4xxxx-yxxxx-xxxxx'.replace(/[xy]/g, (c: string) => {
    const r: number = (Math.random() * 16) | 0
    const v: number = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString()
  })
  return str
}