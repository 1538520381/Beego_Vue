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
}, {
    path: '/test1', name: 'Test1', component: () => import('@/views/test/index1.vue')
}, {
    path: '/test2', name: 'Test2', component: () => import('@/views/test/index2.vue')
}, {
    path: '/workbenchTest', name: 'workbenchTest', component: () => import("@/views/workbench/workbench.vue")
}]

const router = createRouter({
    history: createWebHistory(), routes: routes
})

export default router