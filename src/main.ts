import { createApp } from 'vue'
import App from './App.vue'
// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'
// 引入状态管理
import { setupStore } from '@/store'
// 引入路由
import { setupRouter } from './router'

// 引入windi css
import '@/plugins/windi.css'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 引入element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

// 引入全局样式
import '@/styles/index.less'

// 引入动画
import '@/plugins/animate.css'

// 全局组件
import { setupGlobCom } from '@/components'

import './permission'


const setupAll = async () => {
	const app = createApp(App)

	await setupI18n(app)

	setupStore(app)

	setupRouter(app)

	setupElementPlus(app)

	setupGlobCom(app)

	app.mount('#app')
}

setupAll()
