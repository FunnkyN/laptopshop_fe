import {
    CREATE_POST_FAILURE,
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    DELETE_POST_FAILURE,
    DELETE_POST_REQUEST,
    DELETE_POST_SUCCESS,
    GET_ALL_POSTS_FAILURE,
    GET_ALL_POSTS_REQUEST,
    GET_ALL_POSTS_SUCCESS,
    GET_POST_BY_ID_FAILURE,
    GET_POST_BY_ID_REQUEST,
    GET_POST_BY_ID_SUCCESS,
    UPDATE_POST_FAILURE,
    UPDATE_POST_REQUEST,
    UPDATE_POST_SUCCESS
} from "./ActionType";

const initialState = {
    posts: [],
    post: null,
    loading: false,
    error: null,
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_ALL_POSTS_REQUEST:
        case GET_POST_BY_ID_REQUEST:
        case CREATE_POST_REQUEST:
        case UPDATE_POST_REQUEST:
        case DELETE_POST_REQUEST:
            return { ...state, loading: true, error: null };

        case GET_ALL_POSTS_SUCCESS:
            return { ...state, loading: false, posts: action.payload };

        case GET_POST_BY_ID_SUCCESS:
            return { ...state, loading: false, post: action.payload };

        case CREATE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: [action.payload, ...state.posts],
            };

        case UPDATE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                post: action.payload,
                posts: state.posts.map((item) =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };

        case DELETE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                posts: state.posts.filter((item) => item.id !== action.payload),
            };

        case GET_ALL_POSTS_FAILURE:
        case GET_POST_BY_ID_FAILURE:
        case CREATE_POST_FAILURE:
        case UPDATE_POST_FAILURE:
        case DELETE_POST_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

export default postReducer;