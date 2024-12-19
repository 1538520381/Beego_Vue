import axios from 'axios'

import {getQueryString, isEmpty} from "@/utils/common";

const request = axios.create({
    baseURL: '/api', timeout: 50000,
})

request.interceptors.request.use(config => {
    let token = getQueryString("token")
    if (!isEmpty(localStorage.getItem('token'))) {
        config.headers['Authorization'] = localStorage.getItem('token')
    } else if (!isEmpty(token)) {
        config.headers['Authorization'] = token
    }

    return config;
}, error => {
    return Promise.reject(error);
})

request.interceptors.response.use(response => {
    return response;
}, error => {
    return Promise.reject(error);
})

export default request;