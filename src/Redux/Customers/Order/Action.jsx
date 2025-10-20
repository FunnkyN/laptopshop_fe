import {
  SET_SELECTED_CART_ITEMS,
  CREATE_ORDER_FAILURE,
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  GET_ORDER_BY_ID_FAILURE,
  GET_ORDER_BY_ID_REQUEST,
  GET_ORDER_BY_ID_SUCCESS,
  GET_ORDER_HISTORY_FAILURE,
  GET_ORDER_HISTORY_REQUEST,
  GET_ORDER_HISTORY_SUCCESS,
  SET_ORDER_DATA,

} from "./ActionType";
import api, { API_BASE_URL } from "../../../Config/api";
import { getUser } from "../../Auth/Action";

export const setOrderData = (data) => ({
    type: SET_ORDER_DATA,
    payload: data,
});

export const setSelectedCartItems = (cartItems) => ({
  type: SET_SELECTED_CART_ITEMS,
  payload: cartItems,
});

export const createOrder = (orderData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ORDER_REQUEST });

    const payload = {
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      cartItems: orderData.cartItems
    };

    const { data } = await api.post(`${API_BASE_URL}/api/orders/`, payload);

    if (data.id) {

       if(orderData.navigate) {
           orderData.navigate({ search: `step=3&order_id=${data.id}` });
       }
    }

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data,
    });

    const jwt = localStorage.getItem("jwt");
    if (jwt) {
        dispatch(getUser(jwt));
    }

  } catch (error) {
    console.error("Create Order Error:", error);
    let errorMessage = "Đã xảy ra lỗi trong quá trình tạo đơn hàng.";
    if (error.response && error.response.data) {
        errorMessage = error.response.data.message || error.response.data.error || errorMessage;
    }
    dispatch({
      type: CREATE_ORDER_FAILURE,
      payload: errorMessage
    });
  }
};

export const getOrderById = (orderId) => async (dispatch) => {
  try {
    dispatch({ type: GET_ORDER_BY_ID_REQUEST });
    const { data } = await api.get(`/api/orders/${orderId}`);
    dispatch({
      type: GET_ORDER_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ORDER_BY_ID_FAILURE,
      payload: error.message,
    });
  }
};

export const getOrderHistory = (status='',page=1) => async (dispatch) => {
  try {
    dispatch({ type: GET_ORDER_HISTORY_REQUEST });
    const { data } = await api.get(`/api/orders/user?status=${status}&page=${page}`);
    dispatch({
      type: GET_ORDER_HISTORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: GET_ORDER_HISTORY_FAILURE,
      payload: error.message,
    });
  }
};