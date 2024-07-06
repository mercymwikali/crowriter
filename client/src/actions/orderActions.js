import axios from "axios";
import { API_URL as API } from "../config";
import {
  NEW_ORDER_LIST_FAIL,
  NEW_ORDER_LIST_REQUEST,
  NEW_ORDER_LIST_RESET,
  NEW_ORDER_LIST_SUCCESS,
  ORDER_CANCEL_FAIL,
  ORDER_CANCEL_REQUEST,
  ORDER_CANCEL_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_EDIT_FAIL,
  ORDER_EDIT_REQUEST,
  ORDER_EDIT_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
} from "../constants/ordersConstant";
import { message } from "antd";

export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.post(`${API}orders/create`, order, config);

    dispatch({ type: ORDER_CREATE_SUCCESS, payload: data });
    message.success(data.message, 5);
    console.log(data);
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listOrders = (freelancerId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },

      withCredentials: true,
    };

    const { data } = await axios.get(
      `${API}orders/list/${freelancerId}`,
      config
    );

    console.log(data);

    dispatch({ type: ORDER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message, 5);
  }
};

export const editJob = (id, job) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_EDIT_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.patch(
      `${API}orders/update/${id}`,
      job,
      config
    );

    dispatch({ type: ORDER_EDIT_SUCCESS, payload: data });

    message.success(data.message, 5);
  } catch (error) {
    dispatch({
      type: ORDER_EDIT_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message, 5);
  }
};

export const newOrdersList = () => async (dispatch, getState) => {
  //new Orders list for admin use
  try {
    dispatch({ type: NEW_ORDER_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.get(`${API}orders/neworders`, config);

    dispatch({ type: NEW_ORDER_LIST_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NEW_ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    dispatch({ type: NEW_ORDER_LIST_RESET });

    message.error(error.response.data.message, 5);
  }
};

export const cancelOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ORDER_CANCEL_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.patch(
      `${API}orders/cancel`,
      { orderId },
      config
    );

    dispatch({ type: ORDER_CANCEL_SUCCESS, payload: data });
    message.success(data.message, 5);
  } catch (error) {
    dispatch({
      type: ORDER_CANCEL_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message, 5);
  }
};
