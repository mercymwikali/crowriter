import axios from "axios";
import { API_URL as API } from "../config";
import {
  REVIEW_CREATE_FAIL,
  REVIEW_CREATE_REQUEST,
  REVIEW_CREATE_RESET,
  REVIEW_CREATE_SUCCESS,
} from "../constants/reviewConstants";
import { message } from "antd";

export const rateFreelancer = (reviewData) => async (dispatch, getState) => {
    try {
        dispatch({ type: REVIEW_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
        };

        const { data } = await axios.post(
            `${API}reviews/create`,
            reviewData,
            config
        );

        dispatch({ type: REVIEW_CREATE_SUCCESS, payload: data });

        message.success(data.message, 5);


        dispatch({ type: REVIEW_CREATE_RESET });
    } catch (error) {
        console.error('Error creating review:', error);
        dispatch({
            type: REVIEW_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });

        message.error(
            error.response ? error.response.data.message : error.message,
            5
        );
    }

    dispatch({ type: REVIEW_CREATE_RESET });
};
