import {
  CREATE_LAPTOP_REQUEST,
  CREATE_LAPTOP_SUCCESS,
  CREATE_LAPTOP_FAILURE,
  UPDATE_LAPTOP_REQUEST,
  UPDATE_LAPTOP_SUCCESS,
  UPDATE_LAPTOP_FAILURE,
  DELETE_LAPTOP_REQUEST,
  DELETE_LAPTOP_SUCCESS,
  DELETE_LAPTOP_FAILURE,
  UPLOAD_FILES_REQUEST,
  UPLOAD_FILES_SUCCESS,
  UPLOAD_FILES_FAILURE,
  GET_LAPTOPS_REQUEST,
  GET_LAPTOPS_SUCCESS,
  GET_LAPTOPS_FAILURE,
  SEARCH_LAPTOP_REQUEST,
  SEARCH_LAPTOP_SUCCESS,
  SEARCH_LAPTOP_FAILURE,
  FIND_LAPTOP_BY_ID_REQUEST,
  FIND_LAPTOP_BY_ID_SUCCESS,
  FIND_LAPTOP_BY_ID_FAILURE,
  FIND_LAPTOPS_BY_FILTER_REQUEST,
  FIND_LAPTOPS_BY_FILTER_SUCCESS,
  FIND_LAPTOPS_BY_FILTER_FAILURE,
} from "./ActionType";
import api, { API_BASE_URL } from "../../../Config/api";

export const searchLaptop = (keyword) => async (dispatch) => {
  try {
    dispatch({ type: SEARCH_LAPTOP_REQUEST });
    const { data } = await api.get(`/laptops/search`, {
      params: { q: keyword }
    });
    dispatch({ type: SEARCH_LAPTOP_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: SEARCH_LAPTOP_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const getAllLaptops = () => async (dispatch) => {
  try {
    dispatch({ type: GET_LAPTOPS_REQUEST });
    const { data } = await api.get(`${API_BASE_URL}/laptops`);
    dispatch({ type: GET_LAPTOPS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: GET_LAPTOPS_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const findLaptopById = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: FIND_LAPTOP_BY_ID_REQUEST });
    const { data } = await api.get(`/laptops/${reqData.laptopId}`);
    dispatch({ type: FIND_LAPTOP_BY_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: FIND_LAPTOP_BY_ID_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

// --- ĐÃ SỬA LỖI TẠI ĐÂY ---
export const findLaptops = (reqData) => async (dispatch) => {
  const {
    gpuIds,
    diskCapacity,
    brandId,
    cpuId,
    minPrice,
    maxPrice,
    minRamMemory,
    maxRamMemory,
    page,
    size,
    color,
    sortPrice,
    category,
    stock
  } = reqData;

  try {
    dispatch({ type: FIND_LAPTOPS_BY_FILTER_REQUEST });
    const queryParams = new URLSearchParams();

    if (gpuIds) queryParams.append("gpuIds", gpuIds.join(","));
    
    // Sửa lỗi Disk Capacity (nếu minDisk là 0)
    if (diskCapacity) {
      if(diskCapacity[0] !== undefined && diskCapacity[0] !== null) queryParams.append("minDiskCapacity", diskCapacity[0]);
      if(diskCapacity[1] !== undefined && diskCapacity[1] !== null) queryParams.append("maxDiskCapacity", diskCapacity[1]);
    }

    if (brandId) queryParams.append("brandId", brandId);
    if (cpuId) queryParams.append("cpuId", cpuId);

    // Sửa lỗi RAM (nếu ram là 0 - ít gặp nhưng an toàn)
    if (minRamMemory !== undefined && minRamMemory !== null) queryParams.append("minRamMemory", minRamMemory);
    if (maxRamMemory !== undefined && maxRamMemory !== null) queryParams.append("maxRamMemory", maxRamMemory);

    // Sửa lỗi Giá (nếu minPrice là 0)
    if (minPrice !== undefined && minPrice !== null) queryParams.append("minPrice", minPrice);
    if (maxPrice !== undefined && maxPrice !== null) queryParams.append("maxPrice", maxPrice);

    if (color) queryParams.append("colors", color);
    if (category) queryParams.append("category", category);
    if (sortPrice) queryParams.append("sortPrice", sortPrice);
    
    // Sửa lỗi Stock (nếu stock là 0)
    if (stock !== undefined && stock !== null) queryParams.append("stockStatus", stock);

    if (page !== undefined && page !== null) queryParams.append("page", page);
    if (size !== undefined) queryParams.append("size", size);

    console.log('Request params:', queryParams.toString());

    const res = await api.get(`/laptops/filter?${queryParams.toString()}`);

    dispatch({
      type: FIND_LAPTOPS_BY_FILTER_SUCCESS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: FIND_LAPTOPS_BY_FILTER_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};
// --- HẾT PHẦN SỬA ---

export const createLaptop = (laptop) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_LAPTOP_REQUEST });
    const { data } = await api.post(`${API_BASE_URL}/laptops/api/admin`, laptop.data);
    dispatch({ type: CREATE_LAPTOP_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: CREATE_LAPTOP_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const uploadFiles = (laptopId, formData) => async (dispatch) => {
  try {
    dispatch({ type: UPLOAD_FILES_REQUEST });
    const { data } = await api.post(
      `${API_BASE_URL}/laptops/api/admin/${laptopId}/images`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    dispatch({ type: UPLOAD_FILES_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: UPLOAD_FILES_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const updateLaptop = (options) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_LAPTOP_REQUEST });
    const { data } = await api.put(
      `${API_BASE_URL}/laptops/api/admin/${options.id}`,
      options
    );
    dispatch({ type: UPDATE_LAPTOP_SUCCESS, payload: data });
    return data;
  } catch (error) {
    dispatch({
      type: UPDATE_LAPTOP_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
};

export const deleteLaptop = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_LAPTOP_REQUEST });
    await api.put(`/laptops/api/delete/${id}`);
    dispatch({ type: DELETE_LAPTOP_SUCCESS, payload: id });
  } catch (error) {
    dispatch({
      type: DELETE_LAPTOP_FAILURE,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
    });
  }
}