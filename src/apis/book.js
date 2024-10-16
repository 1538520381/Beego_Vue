import request from '@/utils/request'

export function getBookList() {
    return request({
        url: '/book/list', method: 'post'
    })
}

export function collection(bookId) {
    return request({
        url: '/user/book/add', method: 'post', data: {
            book_id: bookId
        }
    })
}

export function uncollection(bookId) {
    return request({
        url: '/user/book/remove', method: 'post', data: {
            book_id: bookId
        }
    })
}

export function getCollectionBookList() {
    return request({
        url: '/user/book/list', method: 'post'
    })
}

export function getCatalogueByBookId(bookId) {
    return request({
        url: '/book/getOutline', method: 'post', data: {
            book_id: bookId
        }
    })
}