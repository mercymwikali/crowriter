import axios from 'axios';
import { API_URL as API } from '../config';
import { 
    PAYMENT_CREATE_FAIL, 
    PAYMENT_CREATE_REQUEST, 
    PAYMENT_CREATE_SUCCESS, 
    PAYMENT_DETAILS_FAIL, 
    PAYMENT_DETAILS_REQUEST, 
    PAYMENT_DETAILS_SUCCESS, 
    PAYMENT_LIST_FAIL, 
    PAYMENT_LIST_REQUEST, 
    PAYMENT_LIST_SUCCESS 
} from '../constants/paymentConstants';
import { message } from 'antd';

export const postPayment = (data) => async (dispatch, getState) => {
    try {
        dispatch({ type: PAYMENT_CREATE_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
            withCredentials: true,
        };

        const { data: res } = await axios.post(`${API}payments/create`, data, config);

        dispatch({ type: PAYMENT_CREATE_SUCCESS, payload: res });

    } catch (error) {
        dispatch({
            type: PAYMENT_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });

        message.error(error.response.data.message, 5);
    }
};

export const paymentList = () => async (dispatch, getState) => {
    try {
        dispatch({ type: PAYMENT_LIST_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
            withCredentials: true,
        };

        const { data: res } = await axios.get(`${API}payments/list`, config);

        dispatch({ type: PAYMENT_LIST_SUCCESS, payload: res });

    } catch (error) {
        dispatch({
            type: PAYMENT_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const paymentDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PAYMENT_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.accessToken}`,
            },
            withCredentials: true,
        };

        const { data: res } = await axios.get(`${API}payment/details/${id}`, config);

        dispatch({ type: PAYMENT_DETAILS_SUCCESS, payload: res });

    } catch (error) {
        dispatch({
            type: PAYMENT_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
