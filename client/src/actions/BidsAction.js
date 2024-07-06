import axios from "axios";
import { API_URL as API } from "../config";
import {
  BIDS_LIST_FAIL,
  BIDS_LIST_REQUEST,
  BIDS_LIST_RESET,
  BIDS_LIST_SUCCESS,
  BID_CREATE_FAIL,
  BID_CREATE_REQUEST,
  BID_CREATE_SUCCESS,
  BID_DELETE_FAIL,
  BID_DELETE_REQUEST,
  BID_DELETE_SUCCESS,
  BID_DETAILS_USER_FAIL,
  BID_DETAILS_USER_REQUEST,
  BID_DETAILS_USER_SUCCESS,
} from "../constants/bidsConstant";
import { message } from "antd";
import useAuth from "../hooks/useAuth";

export const createBid =
  (orderId, freelancerId) => async (dispatch, getState) => {
    try {
      dispatch({ type: BID_CREATE_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      };

      const bid = { freelancerId, orderId }; // Include both freelancerId and orderId

      const { data } = await axios.post(`${API}bids/create`, bid, config);

      dispatch({ type: BID_CREATE_SUCCESS, payload: data });

      message.success(data.message, 5);
    } catch (error) {
      dispatch({
        type: BID_CREATE_FAIL,
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
  };
export const freelancerBids = (freelancerId) => async (dispatch, getState) => {
  try {
    dispatch({ type: BID_DETAILS_USER_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    //   const freelancerId = useAuth()?.user?.id;

    console.log(freelancerId);

    const { data } = await axios.get(
      `${API}bids/freelancer/${freelancerId}`,
      config
    );

    dispatch({ type: BID_DETAILS_USER_SUCCESS, payload: data });

    console.log(data);
  } catch (error) {
    dispatch({
      type: BID_DETAILS_USER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    message.error(error.response.data.message, 5);
  }
};

export const bidsList = () => async (dispatch, getState) => {
  try {
    dispatch({ type: BIDS_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.get(`${API}bids/list`, config);

    dispatch({ type: BIDS_LIST_SUCCESS, payload: data });

    console.log(data);
  } catch (error) {
    dispatch({
      type: BIDS_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    dispatch({ type: BIDS_LIST_RESET });
  }
};

export const deleteBid = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: BID_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.delete(`${API}bids/delete/${id}`, config);

    dispatch({ type: BID_DELETE_SUCCESS, payload: data });

    message.success(data.message, 5);
  } catch (error) {
    dispatch({
      type: BID_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
