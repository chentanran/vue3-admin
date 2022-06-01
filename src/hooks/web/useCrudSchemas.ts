import { reactive } from 'vue'
import { eachTree, treeMap, filter } from '@/utils/tree'
import { findIndex } from '@/utils'
import { useDictStoreWithOut } from '@/store/modules/dict'
import { useI18n } from '@/hooks/web/useI18n'
import type { AxiosPromise } from 'axios'

type CurdSearchParams = {
	// 是否显示查询项
	show?: boolean
	// 字典名称， 会去取全局字典
	dictName?: string
	// 接口路径
	dictUrl?: string
} & Omit<FormSchema, 'field'>

type CurdTableParams = {
	// 是否显示表头
	show?: boolean
} & Omit<FormSchema, 'field'>

type CurdFormParams = {
	// 是否显示表单项
	show?: boolean
} & Omit<FormSchema, 'field'>

type CurdDescriptionsParams = {
	// 是否显示表单项
	show?: boolean
} & Omit<DescriptionsSchema, 'field'>

export type CrudSchema = Omit<TableColumn, 'children'> & {
	search?: CurdSearchParams
	table?: CurdTableParams
	form?: CurdFormParams
	detail?: CurdDescriptionsParams
	children?: CrudSchema[]
}

const { t } = useI18n()

const dictStore = useDictStoreWithOut()

interface AllSchemas {
	searchSchema: FormSchema[]
	tableColumns: TableColumn[]
	formSchema: FormSchema[]
	detailSchema: DescriptionsSchema[]
}

// 过滤所有结构
export const useCrudSchemas = (
	curdSchema: CrudSchema[]
) : {
	allSchemas: AllSchemas
} => {
	// 所有数据结构
	const allSchemas = reactive<AllSchemas>({
		searchSchema: [],
		tableColumns: [],
		formSchema: [],
		detailSchema: []
	})

	const searchSchema = filterSearchSchema(curdSchema, allSchemas)
	allSchemas.searchSchema = searchSchema || []

	const tableColumns = filterTableSchema(curdSchema)
	allSchemas.tableColumns = tableColumns || []

	const formSchema = filterFormSchema(curdSchema)
	allSchemas.formSchema = formSchema

	const detailSchema = filterDescriptionsSchema(curdSchema)
	allSchemas.detailSchema = detailSchema

	return {
		allSchemas
	}
}

// 过滤 search 结构
const filterSearchSchema = (crudSchema: CrudSchema[], allSchemas: AllSchemas): FormSchema[] => {
	const searchSchema: FormSchema[] = []

	// 获取字典列表队列
	const searchRequestTask: Array<() => Promise<void>> = []

	eachTree(crudSchema, (schemaItem: CrudSchema) => {
		// 判断是否显示
		if (schemaItem?.search?.show) {
			const searchSchemaItem = {
				// 默认为 input
				component: schemaItem.search.component || 'input',
				componentProps: {},
				...schemaItem.search,
				field: schemaItem.field,
				label: schemaItem.label
			}

			if (searchSchemaItem.dictName) {
				// 如果有 dictName 则证明是从字典中获取数据
				const dictArr = dictStore.getDictObj[searchSchemaItem.dictName]
				searchSchemaItem.componentProps!.options = filterOptions(dictArr)
			} else if (searchSchemaItem.api) {
				searchRequestTask.push(async () => {
					const res = await (searchSchemaItem.api as () => AxiosPromise)()
					if (res) {
						const index = findIndex(allSchemas.searchSchema, (v: FormSchema) => {
							return v.field === searchSchemaItem.field
						})
						if (index !== -1) {
							allSchemas.searchSchema[index]!.componentProps!.options = filterOptions(
								res.data,
								searchSchemaItem.componentProps.optionsAlias?.labelField
							)
						}
					}
				})
			}

			// 删除不必要的字段
			delete searchSchemaItem.show
			delete searchSchemaItem.dictName

			searchSchema.push(searchSchemaItem)
		}
	})

	for (const task of searchRequestTask) {
		task()
	}

	return searchSchema
}

// 过滤 table 结构
const filterTableSchema = (curdSchema: CrudSchema[]): TableColumn[] => {
	const tableColumns = treeMap<CrudSchema>(curdSchema, {
		conversion: (schema: CrudSchema) => {
			if (schema?.table?.show !== false) {
				return {
					...schema.table,
					...schema
				}
			}
		}
	})
	
	// 第一次过滤会有 undefind 所以需要二次过滤
	return filter<TableColumn>(tableColumns as TableColumn[], (data) => {
		if (data.children === void 0) {
			delete data.children
		}
		return !!data.field
	})
}

// 过滤 form 结构
const filterFormSchema = (curdSchemas: CrudSchema[]): FormSchema[] => {
	const formSchema: FormSchema[] = []

	eachTree(curdSchemas, (schemaItem: CrudSchema) => {
		// 判断是否显示
		if (schemaItem?.form?.show !== false) {
			const formSchemaItem = {
				// 默认为 input
				component: (schemaItem.form && schemaItem.form.component) || 'Input',
        ...schemaItem.form,
        field: schemaItem.field,
        label: schemaItem.label
			}

			// 删除不必要的字段
			delete formSchemaItem.show

			formSchema.push(formSchemaItem)
		}
	})
	return formSchema
}

// 过滤 descriptions 结构
const filterDescriptionsSchema = (curdSchema: CrudSchema[]): DescriptionsSchema[] => {
	const descriptionsSchema: FormSchema[] = []

	eachTree(curdSchema, (schemaItem: CrudSchema) => {
		// 判断是否显示
		if (schemaItem?.detail?.show !== false) {
			const descriptionsSchemaItem = {
				...schemaItem.detail,
				field: schemaItem.field,
				label: schemaItem.label
			}

			// 删除不必要的字段
			delete descriptionsSchemaItem.show

			descriptionsSchema.push(descriptionsSchemaItem)
		}
	})
	return descriptionsSchema
}

// 给 options 添加国际化
const filterOptions = (options: Recordable, labelField?: string) => {
	return options.map((v: Recordable) => {
		if (labelField) {
			v['labelField'] = t(v.labelField)
		} else {
			v['label'] = t(v.label)
		}
		return v
	})
}