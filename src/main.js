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


import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'highlight.js/styles/atom-one-light.css' //样式

import VueLatex from 'vatex'

//创建v-highlight全局指令

VMdPreview.use(githubTheme, {
    Hljs: hljs
}).use(createKatexPlugin())

createApp(App).use(router).use(ElementPlus).use(store).use(VMdPreview).use(mavonEditor).use(VueLatex).directive('highlight', function (el) {
    let blocks = el.querySelectorAll('pre code');
    blocks.forEach((block) => {
        hljs.highlightBlock(block)
    })
}).directive('copy', {
    bind: function (el, binding) {
        el.$copy = function () {
            const textarea = document.createElement('textarea');
            textarea.value = binding.value;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('Copy');
            document.body.removeChild(textarea);
        }
        el.addEventListener('click', el.$copy);
    }, unbind: function (el) {
        el.removeEventListener('click', el.$copy);
    }
}).component('svg-icon', SvgIcon).mount('#app')
