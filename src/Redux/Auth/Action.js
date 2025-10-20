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
import api from "../../Config/api"; // Đã đổi từ axios sang api

const extractErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const errorMessage = error.response.data.error || error.response.data.message;
    return errorMessage.replace(/^[^:]+:\s*/, "").replace(/;\s*$/, "").trim();
  }
  return error.message;
};

const signupRequest = () => ({ type: SIGNUP_REQUEST });
const signupSuccess = (user) => ({ type: SIGNUP_SUCCESS, payload: user });
const signupFailure = (error) => ({ type: SIGNUP_FAILURE, payload: error });

export const signup = (userData) => async (dispatch) => {
  dispatch(signupRequest());
  try {
    // Sử dụng api thay vì axios
    const response = await api.post(`/auth/signup`, userData);
    const user = response.data;

    if (user.jwt) {
        localStorage.setItem("jwt", user.jwt);
        dispatch(getUser(user.jwt));
    }

    dispatch(signupSuccess(user));
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    dispatch(signupFailure(errorMessage));
  }
};

const loginRequest = () => ({ type: LOGIN_REQUEST });
const loginSuccess = (user) => ({ type: LOGIN_SUCCESS, payload: user });
const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });

export const login = (userData) => async (dispatch) => {
  dispatch(loginRequest());
  try {
    const response = await api.post(`/auth/login`, userData);
    const user = response.data;
    if (user.jwt) localStorage.setItem("jwt", user.jwt);
    dispatch(loginSuccess(user));
    
    // --- XÓA DÒNG NÀY ĐI ---
    // window.location.reload(); 
    // -----------------------
    
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    dispatch(loginFailure(errorMessage));
  }
};

export const getUser = (token) => async (dispatch) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    // Sử dụng api.get, không cần truyền header Authorization thủ công nữa
    // api.js đã có interceptor tự động thêm token và ngrok-header
    const response = await api.get(`/api/users/profile`);
    const user = response.data;
    dispatch({ type: GET_USER_SUCCESS, payload: user });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    dispatch({ type: GET_USER_FAILURE, payload: errorMessage });
  }
};

export const getAllCustomers = (token) => async (dispatch) => {
  dispatch({ type: GET_ALL_CUSTOMERS_REQUEST });
  try {
    // Tương tự, dùng api.get
    const response = await api.get(`/api/admin/users`);
    const users = response.data;
    dispatch({ type: GET_ALL_CUSTOMERS_SUCCESS, payload: users });
  } catch (error) {
    const errorMessage = extractErrorMessage(error);
    dispatch({ type: GET_ALL_CUSTOMERS_FAILURE, payload: errorMessage });
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  localStorage.clear();
};