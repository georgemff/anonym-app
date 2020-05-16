import { LOCAL_POST, GLOBAL_POST } from '../actions/type';

const initialState = {
    postView: 'local'
}

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOCAL_POST:
            return {
                ...state,
                postView: 'local'
            };
        case GLOBAL_POST:
            return {
                ...state,
                postView: 'global'
            }
        default:
            return state;
    }
}

export default postReducer;