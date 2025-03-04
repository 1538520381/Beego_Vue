import request from '@/utils/request'

export function login(email, password) {
    return request({
        url: '/user/login', method: 'post', data: {
            phoneOrEmail: email, password: password,
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

export function updateInformation(personalInformationForm) {
    return request({
        url: '/user/update', method: 'post', data: {
            user_name: personalInformationForm.userName,
            gender: personalInformationForm.gender,
            school: personalInformationForm.school,
            major: personalInformationForm.major,
            enter_time: personalInformationForm.enterTime
        }
    })
}

export function forgetPassword(forgetPasswordForm) {
    return request({
        url: '/forget/password', method: 'post', data: {
            phoneOrEmail: forgetPasswordForm.email,
            user_verify_code: forgetPasswordForm.verifyCode,
            new_password: forgetPasswordForm.password
        }
    })
}

export function changePassword(changePasswordForm) {
    return request({
        url: '/user/update/password', method: 'post', data: {
            phoneOrEmail: changePasswordForm.email,
            user_verify_code: changePasswordForm.verifyCode,
            new_password: changePasswordForm.password
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