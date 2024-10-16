import {createStore} from "vuex";

export default createStore({
    state: {
        bookId: null, bookList: null,
    }, mutations: {
        setBookId(state, bookId) {
            state.bookId = bookId;
        }, setBookList(state, bookList) {
            state.bookList = bookList;
        }
    }, actions: {}, modules: {}
})