import request from '@/utils/request'

export function getWorkbenchRobotList() {
    return request({
        url: '/bot/list', method: 'post'
    })
}

export function getLearningCornerRobotList() {
    return request({
        url: '/bot/list/coStudy', method: 'post'
    })
}

export function addSession(botId) {
    return request({
        url: '/session/create', method: 'post', params: {
            bot_id: botId
        }
    })
}

export function deleteSession(sessionId) {
    return request({
        url: '/session/remove', method: 'post', params: {
            session_id: sessionId
        }
    })
}

export function getSessionList(botId) {
    return request({
        url: '/session/retrieve', method: 'post', params: {
            bot_id: botId,
        }
    })
}

export function getMessageList(sessionId) {
    return request({
        url: '/message/list', method: 'post', data: {
            session_id: sessionId, limit: 2147483647
        }
    })
}
