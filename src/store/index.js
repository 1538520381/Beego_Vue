import {createStore} from "vuex";

export default createStore({
    state: {
        book: null, bookList: null,
    }, mutations: {
        setBook(state, book) {
            state.book = book;
        }, setBookList(state, bookList) {
            state.bookList = bookList;
        }
    }, actions: {}, modules: {}
})