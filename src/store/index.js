import {createStore} from "vuex";

export default createStore({
    state: {
        book: null, bookList: null, longTextDialogueExecuteEntitys: []
    }, mutations: {
        setBook(state, book) {
            state.book = book;
        }, setBookList(state, bookList) {
            state.bookList = bookList;
        }, setLongTextDialogueExecuteEntitys(state, longTextDialogueExecuteEntitys) {
            state.longTextDialogueExecuteEntitys = longTextDialogueExecuteEntitys;
        }
    }, actions: {}, modules: {}
})