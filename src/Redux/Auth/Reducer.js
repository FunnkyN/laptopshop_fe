import {
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    GET_USER_FAILURE,
    LOGOUT,
    GET_ALL_CUSTOMERS_REQUEST,
    GET_ALL_CUSTOMERS_SUCCESS,
    GET_ALL_CUSTOMERS_FAILURE,
} from "./ActionTypes";

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    customers: [],
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGNUP_REQUEST:
        case LOGIN_REQUEST:
            return { ...state, isLoading: true, error: null };

        case SIGNUP_SUCCESS:
            return { ...state, isLoading: false };

        case SIGNUP_FAILURE:
        case LOGIN_FAILURE:
            return { ...state, isLoading: false, error: action.payload };

        case LOGIN_SUCCESS:
            return { ...state, isLoading: false };

        case GET_USER_REQUEST:
            return { ...state, isLoading: true, error: null, fetchingUser: true };

        case GET_USER_SUCCESS:
            return {
                ...state,
                isLoading: false,
                user: action.payload,
                fetchingUser: false,
            };

        case GET_ALL_CUSTOMERS_SUCCESS:
            return {
                ...state,
                isLoading: false,
                customers: action.payload,
            };

        case GET_USER_FAILURE:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                fetchingUser: false,
            };

        case LOGOUT:
            localStorage.removeItem("jwt");
            return { ...state, jwt: null, user: null };

        default:
            return state;
    }
};

export default authReducer;

