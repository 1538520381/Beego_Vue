import {createRouter, createWebHistory} from "vue-router";

const routes = [{
    path: '/', redirect: '/home',
}, {
    path: '/home', name: 'Home', component: () => import('@/views/home')
}, {
    path: '/workbench', name: 'Workbench', component: () => import('@/views/workbench')
}, {
    path: '/learningCornerBook', name: 'LearningCornerBook', component: () => import('@/views/learningCornerBook')
}, {
    path: '/learningCornerChat', name: 'LearningCornerChat', component: () => import('@/views/learningCornerChat')
}, {
    path: '/personalCenter', name: 'PersonalCenter', component: () => import('@/views/personalCenter')
}]

const router = createRouter({
    history: createWebHistory(), routes: routes
})

export default router