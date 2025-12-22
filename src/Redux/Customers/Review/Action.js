import {
    CREATE_REVIEW_SUCCESS,
    CREATE_REVIEW_FAILURE,
    GET_ALL_REVIEWS_SUCCESS,
    GET_ALL_REVIEWS_FAILURE,
    CREATE_RATING_SUCCESS,
    CREATE_RATING_FAILURE,
    GET_ALL_RATINGS_SUCCESS,
    GET_ALL_RATINGS_FAILURE
} from './ActionType';
import api from '../../../Config/api';

export const createReview = (resData) => {
    console.log("create review req ", resData)
    return async (dispatch) => {
        try {
            const response = await api.post('/api/reviews/create',
                resData);

            dispatch({
                type: CREATE_REVIEW_SUCCESS,
                payload: response.data
            });
            console.log("create review ", response.data)
        } catch (error) {
            dispatch({
                type: CREATE_REVIEW_FAILURE,
                payload: error.message
            });
        }
    };
};
export const createReview = (resData) => {
    console.log("create review req ", resData)
    return async (dispatch) => {
        try {

export const getAllReviews = (laptopId) => {
    return async (dispatch) => {
        try {
            const response = await api.get(`/api/reviews/laptop/${laptopId}`);
            const responseRating = await api.get(`/api/ratings/laptop/${laptopId}`);
            const ratings = responseRating.data
            console.log('responseRating: ', responseRating)
            const data = response.data.map((item, index) => ({ ...item, rating: ratings[index]?.rating ?? 5 }))
            console.log('data: ', data)

            dispatch({
                type: GET_ALL_REVIEWS_SUCCESS,
               export const createReview = (resData) => {
    console.log("create review req ", resData)
    return async (dispatch) => {
        try { payload: data
            });
            console.log("all review ", response.data)
        } catch (error) {
            dispatch({
                type: GET_ALL_REVIEWS_FAILURE,
                payload: error.message
            });
        }
    };
};

exp
            const response = await api.post('/api/ratings/create',
                resData);

            dispatch({
                type: CREATE_RATING_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: CREATE_RATING_FAILURE,
                payload: error.message
            });
        }
    };
};

export const getAllRatings = (laptopId) => {
    return async (dispatch) => {
        try {
            const response = await api.get(`/api/ratings/laptop/${laptopId}`, {});
            dispatch({
                type: GET_ALL_RATINGS_SUCCESS,
                payload: response.data
            });
            console.log("all rating ", response.data)
        } catch (error) {
            dispatch({
                type: GET_ALL_RATINGS_FAILURE,
                payload: error.message
            });
        }
    };
};

