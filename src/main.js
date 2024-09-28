import {createApp} from 'vue'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import SvgIcon from '@/components/svgIcon'

import 'element-plus/dist/index.css'
import '@/assets/icons'

createApp(App).use(router).use(ElementPlus).component('svg-icon', SvgIcon).mount('#app')
