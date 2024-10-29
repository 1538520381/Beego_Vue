import request from '@/utils/request'

export function login(loginForm) {
    return request({
        url: '/user/login', method: 'post', data: {
            phoneOrEmail: loginForm.email, password: loginForm.password,
        }
    })
}

export function register(registerForm) {
    return request({
        url: '/user/register', method: 'post', data: {
            email: registerForm.email, // user_name: registerForm.userName,
            password: registerForm.password, user_verify_code: registerForm.verifyCode,
        }
    })
}

export function sendEmailVerifyCode(email) {
    return request({
        url: '/user/send/email', method: 'post', params: {
            email: email,
        }
    })
}

export function improvePersonalInformation(personalInformationForm) {
    return request({
        url: '/user/mustInfo', method: 'post', data: {
            user_name: personalInformationForm.userName,
            gender: personalInformationForm.gender,
            school: personalInformationForm.school,
            major: personalInformationForm.major,
            enter_time: personalInformationForm.enterTime
        }
    })
}

export function getUserByToken() {
    return request({
        url: '/user/token', method: 'post'
    })
}

export function logout() {
    return request({
        url: '/user/logout', method: 'post'
    })
}

export function contactUs(content, fileId, fileName, fileUrl, fileType) {
    return request({
        url: '/feedback/save', method: 'post', data: {
            feedback_content: content, file_id: fileId, file_name: fileName, file_url: fileUrl, file_type: fileType
        }
    })
}