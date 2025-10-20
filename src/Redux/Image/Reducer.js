
import {
    FETCH_IMAGE_CAROUSEL_REQUEST,
    FETCH_IMAGE_CAROUSEL_SUCCESS,
    FETCH_IMAGE_CAROUSEL_FAIL,
} from "./ActionTypes";

const initialState = {
    urls: [],
    loading: false,
    error: null
};

const imageReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_IMAGE_CAROUSEL_REQUEST:
            return { ...state, loading: true };
        case FETCH_IMAGE_CAROUSEL_SUCCESS:
            return { ...state, loading: false, urls: action.payload };
        case FETCH_IMAGE_CAROUSEL_FAIL:
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};

export default imageReducer;

