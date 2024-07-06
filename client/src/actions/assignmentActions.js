import axios from "axios";
import { API_URL as API } from "../config";
import {
  ASSIGNMENT_CREATE_FAIL,
  ASSIGNMENT_CREATE_REQUEST,
  ASSIGNMENT_CREATE_SUCCESS,
  ASSIGNMENT_DELETE_FAIL,
  ASSIGNMENT_DELETE_REQUEST,
  ASSIGNMENT_DELETE_SUCCESS,
  ASSIGNMENT_DETAILS_FAIL,
  ASSIGNMENT_DETAILS_REQUEST,
  ASSIGNMENT_DETAILS_RESET,
  ASSIGNMENT_DETAILS_SUCCESS,
  ASSIGNMENT_LIST_FAIL,
  ASSIGNMENT_LIST_REQUEST,
  ASSIGNMENT_LIST_SUCCESS,
  FREELANCER_ASSIGNMENT_LIST_FAIL,
  FREELANCER_ASSIGNMENT_LIST_REQUEST,
  FREELANCER_ASSIGNMENT_LIST_RESET,
  FREELANCER_ASSIGNMENT_LIST_SUCCESS,
} from "../constants/assignmenConstant";
import { message } from "antd";

export const assignOrder =
  (orderId, freelancerId) => async (dispatch, getState) => {
    try {
      dispatch({ type: ASSIGNMENT_CREATE_REQUEST });

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
        `${API}orders/assign`,
        { orderId, freelancerId },
        config
      );

      dispatch({ type: ASSIGNMENT_CREATE_SUCCESS, payload: data });

      console.log(data);
      message.success(data.message, 5);
    } catch (error) {
      dispatch({
        type: ASSIGNMENT_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      message.error(error.response.data.message, 5);
    }
  };

export const getAssignment = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: "ASSIGNMENT_DETAILS_REQUEST" });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.get(`${API}assignments/${id}`, config);

    dispatch({ type: "ASSIGNMENT_DETAILS_SUCCESS", payload: data });

    console.log(data);
  } catch (error) {
    dispatch({
      type: "ASSIGNMENT_DETAILS_FAIL",
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listAssignments = () => async (dispatch, getState) => {
  try {
    dispatch({ type: ASSIGNMENT_LIST_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.get(`${API}orders/assign-list`, config);

    dispatch({ type: ASSIGNMENT_LIST_SUCCESS, payload: data });

    console.log(data);
  } catch (error) {
    dispatch({
      type: ASSIGNMENT_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const freelancerAssignments =
  (freelancerId) => async (dispatch, getState) => {
    try {
      dispatch({ type: FREELANCER_ASSIGNMENT_LIST_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.accessToken}`,
        },
      };

      const { data } = await axios.get(
        `${API}orders/get-assignment/${freelancerId}`,
        config
      );

      dispatch({ type: FREELANCER_ASSIGNMENT_LIST_SUCCESS, payload: data });

      console.log(data);
    } catch (error) {
      dispatch({
        type: FREELANCER_ASSIGNMENT_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });

      dispatch({ type: FREELANCER_ASSIGNMENT_LIST_RESET });
    }
  };

export const extendDeadline = (orderId, newDeadline, message) => async (dispatch, getState) => {
  try {
    dispatch({ type: ASSIGNMENT_DETAILS_REQUEST });

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
      `${API}orders/extend-deadline/${orderId}`,
      {newDeadline, message},
      config
    );

    dispatch({ type: ASSIGNMENT_DETAILS_SUCCESS, payload: data });

    message.success(data.message, 5);

    console.log(data);
  } catch (error) {
    dispatch({
      type: ASSIGNMENT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    await message.error(error.response.data.message, 5);

    dispatch({ type: ASSIGNMENT_DETAILS_RESET });
  }
};

export const reassign = (orderId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ASSIGNMENT_DETAILS_REQUEST });

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
      `${API}orders/reassign/${orderId}`,
      {},
      config
    );

    dispatch({ type: ASSIGNMENT_DETAILS_SUCCESS, payload: data });

    message.success(data.message, 5);

    console.log(data);
  } catch (error) {
    dispatch({
      type: ASSIGNMENT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

     message.error(error.response.data.message, 5);
  }
};

export const deleteAssignment = (assignmentId) => async (dispatch, getState) => {
  try {
    dispatch({ type: ASSIGNMENT_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.accessToken}`,
      },
    };

    const { data } = await axios.delete(
      `${API}orders/delete-assignment/${assignmentId}`,
      {message},
      config
    );

    dispatch({ type: ASSIGNMENT_DELETE_SUCCESS, payload: data });

    message.success(data.message, 5);

    console.log(data);
  } catch (error) {
    dispatch({
      type: ASSIGNMENT_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });

    await message.error(error.response.data.message, 5);

  }
};
