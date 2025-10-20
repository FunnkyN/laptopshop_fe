import {
    GET_LAPTOPS_REQUEST,
    GET_LAPTOPS_SUCCESS,
    GET_LAPTOPS_FAILURE,
    CREATE_LAPTOP_REQUEST,
    CREATE_LAPTOP_SUCCESS,
    CREATE_LAPTOP_FAILURE,
    UPDATE_LAPTOP_SUCCESS,
    UPDATE_LAPTOP_FAILURE,
    DELETE_LAPTOP_REQUEST,
    DELETE_LAPTOP_SUCCESS,
    DELETE_LAPTOP_FAILURE,
    UPLOAD_FILES_REQUEST,
    UPLOAD_FILES_SUCCESS,
    UPLOAD_FILES_FAILURE,
    FIND_LAPTOP_BY_ID_REQUEST,
    FIND_LAPTOP_BY_ID_SUCCESS,
    FIND_LAPTOP_BY_ID_FAILURE,
    FIND_LAPTOPS_BY_FILTER_REQUEST,
    FIND_LAPTOPS_BY_FILTER_SUCCESS,
    FIND_LAPTOPS_BY_FILTER_FAILURE,
    SEARCH_LAPTOP_SUCCESS,
    UPDATE_LAPTOP_REQUEST
} from "./ActionType";

const initialState = {
    laptops: [],
    laptop: null,
    loading: false,
    error: null,
    deleteLaptop: null,
    searchLaptops: []
};

const laptopReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_LAPTOPS_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_LAPTOPS_SUCCESS:
            return { ...state, loading: false, laptops: action.payload };
        case GET_LAPTOPS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case FIND_LAPTOP_BY_ID_REQUEST:
            return { ...state, loading: true, error: null };
        case FIND_LAPTOP_BY_ID_SUCCESS:
            return { ...state, laptop: action.payload, loading: false };
        case FIND_LAPTOP_BY_ID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case FIND_LAPTOPS_BY_FILTER_REQUEST:
            return { ...state, loading: true, error: null };
        case FIND_LAPTOPS_BY_FILTER_SUCCESS:

            return { ...state, laptops: action.payload, loading: false };
        case FIND_LAPTOPS_BY_FILTER_FAILURE:
            return { ...state, loading: false, laptops: [], error: action.payload };

        case CREATE_LAPTOP_REQUEST:
            return { ...state, loading: true, error: null };
        case CREATE_LAPTOP_SUCCESS:
            return {
                ...state,
                loading: false,
                laptop: action.payload,
            };
        case CREATE_LAPTOP_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case UPLOAD_FILES_REQUEST:
            return { ...state, loading: true };
        case UPLOAD_FILES_SUCCESS:
            return { ...state, loading: false };
        case UPLOAD_FILES_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case UPDATE_LAPTOP_REQUEST:
            return { ...state, loading: true, error: null };
        case UPDATE_LAPTOP_SUCCESS:
            let updatedLaptops = state.laptops;

            if (state.laptops && state.laptops.content) {
                updatedLaptops = {
                    ...state.laptops,
                    content: state.laptops.content.map((laptop) =>
                        laptop.id === action.payload.id ? action.payload : laptop
                    )
                };
            }
            return {
                ...state,
                loading: false,
                laptops: updatedLaptops,
            };
        case UPDATE_LAPTOP_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case DELETE_LAPTOP_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_LAPTOP_SUCCESS:
            let filteredLaptops = state.laptops;

            if (state.laptops && state.laptops.content) {
                filteredLaptops = {
                    ...state.laptops,
                    content: state.laptops.content.filter(
                        (laptop) => laptop.id !== action.payload
                    )
                };
            }
            return {
                ...state,
                loading: false,
                laptops: filteredLaptops,
                deleteLaptop: action.payload
            };
        case DELETE_LAPTOP_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case SEARCH_LAPTOP_SUCCESS:
            return { ...state, loading: false, searchLaptops: action.payload };

        default:
            return state;
    }
};

export default laptopReducer;