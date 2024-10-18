import {createApp} from 'vue'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import SvgIcon from '@/components/svgIcon'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import githubTheme from '@kangc/v-md-editor/lib/theme/github'
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn'
import store from '@/store'
import hljs from 'highlight.js'

import 'element-plus/dist/index.css'
import '@/assets/icons'
import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/theme/style/github.css'


VMdPreview.use(githubTheme, {
    Hljs: hljs
}).use(createKatexPlugin())

createApp(App).use(router).use(ElementPlus).use(store).use(VMdPreview).component('svg-icon', SvgIcon).mount('#app')
