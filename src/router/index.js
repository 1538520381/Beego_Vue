import {createRouter, createWebHistory} from "vue-router";

const routes = [{
    path: '/', redirect: '/home',
}, {
    path: '/home', name: 'Home', component: () => import('@/views/home')
}, {
    path: '/workbenchTest', name: 'Workbench', component: () => import('@/views/workbench')
}, {
    path: '/learningCornerBookTest', name: 'LearningCornerBook', component: () => import('@/views/learningCornerBook')
}, {
    path: '/learningCornerChatTest', name: 'LearningCornerChat', component: () => import('@/views/learningCornerChat')
}, {
    path: '/personalCenter', name: 'PersonalCenter', component: () => import('@/views/personalCenter')
}, {
    path: '/test1', name: 'Test1', component: () => import('@/views/test/index1.vue')
}, {
    path: '/test2', name: 'Test2', component: () => import('@/views/test/index2.vue')
}, {
    path: '/workbench', name: 'workbenchTest', component: () => import("@/views/workbench/workbench.vue")
}, {
    path: '/homeTest', name: 'homeTest', component: () => import("@/views/home/home.vue")
}, {
    path: '/learningCornerBook',
    name: 'learningCornerBook',
    component: () => import("@/views/learningCornerBook/learningCornerBook.vue")
}, {
    path: '/learningCornerChat',
    name: 'learningCornerChat',
    component: () => import("@/views/learningCornerChat/learningCornerChat.vue")
}, {
    path: '/wechat/learningCornerBook',
    name: 'wechatLearningCornerBook',
    component: () => import("@/views/wechat/learningCornerBook/learningCornerBook.vue")
}, {
    path: '/wechat/learningCornerChat',
    name: 'wechatLearningCornerChat',
    component: () => import("@/views/wechat/learningCornerChat/learningCornerChat.vue")
}]

const router = createRouter({
    history: createWebHistory(), routes: routes
})

export default router