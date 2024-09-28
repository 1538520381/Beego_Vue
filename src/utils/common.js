export function sleep(delay) {
    return new Promise((resolve) => setTimeout(resolve, delay));
}

export function isEmpty(field) {
    return field === null || field === undefined || field === '';
}