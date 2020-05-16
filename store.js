import { createStore, combineReducers } from "redux";
import postReducer from "./reducers/postReducer";

const rootReducer = combineReducers({
    postView: postReducer
})

export const store = createStore(rootReducer);