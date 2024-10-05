import {createRouter, createWebHistory} from "vue-router";

const routes = [{
    path: '/', redirect: '/home',
}, {
    path: '/home', name: 'Home', component: () => import('@/views/home')
}, {
    path: '/workbench', name: 'Workbench', component: () => import('@/views/workbench')
}, {
    path: '/learningCorner', name: 'LearningCorner', component: () => import('@/views/learningCorner')
}]

const router = createRouter({
    history: createWebHistory(), routes: routes
})

export default router