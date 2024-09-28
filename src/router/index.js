import {createRouter, createWebHistory} from "vue-router";

const routes = [{
    path: '/', redirect: '/home',
}, {
    path: '/home', name: 'Home', component: () => import('@/views/home')
}, {
    path: '/chat', name: 'Chat', component: () => import('@/views/chat')
}]

const router = createRouter({
    history: createWebHistory(), routes: routes
})

export default router