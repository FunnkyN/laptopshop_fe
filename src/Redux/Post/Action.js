import api from "../../Config/api";
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

exporr) {
        dispatch({ type: GET_ALL_POSTS_FAILURE, payload: error.message });
    }
};

export const getLatestPosts = (limit = 4) => async (dispatch) => {

    dispatch({ type: GET_ALL_POSTS_REQUEST });
    try {
        const { data } = await api.get(`/api/posts/latest?limit=${limit}`);
        dispatch({ type: GET_ALL_POSTS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_ALL_POSTS_FAILURE, payload: error.message });
    }
};

export const getPostById = (postId) => async (dispatch) => {
    dispatch({ type: GET_POST_BY_ID_REQUEST });
    try {
        c
};

export const createPost = (postData) => async (dispatch) => {
    dispatch({ type: CREATE_POST_REQUEST });
    try {
        const formData = new FormData();

        formData.append("post", new Blob([JSON.stringify(postData.data)], {
            type: "application/json"
        }));

        if (postData.file) {
            formData.append("file", postData.file);
        }

        const { data } = await api.post('/api/admin/posts', formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
onst { data } = await api.get(`/api/posts/${postId}`);
        dispatch({ type: GET_POST_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_POST_BY_ID_FAILURE, payload: error.message });
    }
        dispatch({ type: CREATE_POST_SUCCESS, payload: data });
        return data;
    } catch (error) {
        dispatch({ type: CREATE_POST_FAILURE, payload: error.message });
    }
};

export const updatePost = (postData) => async (dispatch) => {
    dispatch({ type: UPDATE_POST_REQUEST });
    try {
        const formData = new FormData();
        formData.append("post", new Blob([JSON.stringify(postData.data)], {
            type: "application/json"
        }));

        if (postData.file) {
            formData.append("file", postData.file);
        }

        const { data } = await api.put(`/api/admin/posts/${postData.id}`, formData, {
         

        dispatch({ type: UPDATE_POST_SUCCESS, payload: data });
        return data;
    } catch (error) {
        dispatch({ type: UPDATE_POST_FAILURE, payload: error.message });
    }
};

export const deletePost = (postId) => async (dispatch) => {
    dispatch({ type: DELETE_POST_REQUEST });
    try {onst { data } = await api.get(`/api/posts/${postId}`);
        dispatch({ type: GET_POST_BY_ID_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: GET_POST_BY_ID_FAILURE, payload: error.message });
    }
        await api.delete(`/api/admin/posts/${postId}`);
        dispatch({
        dispatch({ type: DELETE_POST_FAILURE, payload: error.message });
    }
};