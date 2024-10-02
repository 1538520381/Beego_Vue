import request from '@/utils/request'

export function getRobotList() {
    return request({
        url: '/bot/list', method: 'post'
    })
}