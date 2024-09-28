export function isEmail(str) {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    return reg.test(str);
}

export function isPassword(str) {
    const reg = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,30}$/;
    return reg.test(str)
}