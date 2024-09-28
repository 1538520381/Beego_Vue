import request from '@/utils/request'

export function login(loginForm) {
    return request({
        url: '/user/login', method: 'post', data: {
            email: loginForm.email, password: loginForm.password,
        }
    })
}

export function register(registerForm) {
    return request({
        url: '/user/register', method: 'post', data: {
            email: registerForm.email,
            user_name: registerForm.userName,
            password: registerForm.password,
            user_verify_code: registerForm.verifyCode,
        }
    })
}

export function sendEmailVerifyCode(email) {
    return request({
        url: '/user/send/email', method: 'post', data: {
            email: email,
        }
    })
}