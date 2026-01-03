
import {
    FETCH_IMAGE_CAROUSEL_REQUEST,
    FETCH_IMAGE_CAROUSEL_SUCCESS,
    FETCH_IMAGE_CAROUSEL_FAIL,
} from "./ActionTypes";
import api from "../../Config/api";

export const fetchCarouselImages = () => async (dispatch) => {
    disp
            type: FETCH_IMAGE_CAROUSEL_SUCCESS,
            payload: response.data,
        });
    } catch (error) {
        dispatch({
            type: FETCH_IMAGE_CAROUSEL_FAIL,
            payload: error.message || "Failed to load carousel images",
        });
    }
};

